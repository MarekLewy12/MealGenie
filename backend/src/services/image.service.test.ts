import fs from "fs";
import os from "os";
import path from "path";
import { jest } from "@jest/globals";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return { promise, resolve };
}

function successfulImageResponse(): Response {
  return {
    ok: true,
    json: async () => ({
      data: [{ b64_json: Buffer.from("fake image").toString("base64") }],
    }),
  } as Response;
}

function rateLimitedResponse(): Response {
  return {
    ok: false,
    status: 429,
    statusText: "Too Many Requests",
    text: async () => '{"error":{"type":"rate_limit"}}',
  } as Response;
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await jest.advanceTimersByTimeAsync(0);
}

describe("image service", () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    jest.resetModules();

    process.env.TOGETHER_API_KEY = "test-key";
    originalCwd = process.cwd();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mealgenie-images-"));
    process.chdir(tempDir);
  });

  afterEach(() => {
    if (originalCwd) {
      process.chdir(originalCwd);
    }
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    delete process.env.TOGETHER_API_KEY;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("starts image generation requests sequentially instead of all at once", async () => {
    const firstResponse = deferred<Response>();
    const secondResponse = deferred<Response>();
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(firstResponse.promise)
      .mockReturnValueOnce(secondResponse.promise);
    global.fetch = fetchMock as typeof fetch;

    const { generateMealImages } = await import("./image.service.js");
    const resultPromise = generateMealImages([
      { name: "Pierwszy posilek", ingredients: [{ name: "ryz" }] },
      { name: "Drugi posilek", ingredients: [{ name: "kurczak" }] },
    ]);

    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    firstResponse.resolve(successfulImageResponse());
    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1499);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    secondResponse.resolve(successfulImageResponse());
    const result = await resultPromise;

    expect(result).toHaveLength(2);
    expect(result.every((url) => url?.startsWith("/meal-images/"))).toBe(true);
  });

  it("retries Together rate limits before giving up on an image", async () => {
    const firstResponse = deferred<Response>();
    const secondResponse = deferred<Response>();
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(firstResponse.promise)
      .mockReturnValueOnce(secondResponse.promise);
    global.fetch = fetchMock as typeof fetch;

    const { generateMealImages } = await import("./image.service.js");
    const resultPromise = generateMealImages([
      { name: "Retry posilek", ingredients: [{ name: "pomidor" }] },
    ]);

    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    firstResponse.resolve(rateLimitedResponse());
    await flushPromises();

    await jest.advanceTimersByTimeAsync(2499);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    secondResponse.resolve(successfulImageResponse());
    await expect(resultPromise).resolves.toEqual([
      expect.stringMatching(/^\/meal-images\/.+\.jpg$/),
    ]);
  });

  it("shares the request limiter across concurrent meal generations", async () => {
    const firstResponse = deferred<Response>();
    const secondResponse = deferred<Response>();
    const thirdResponse = deferred<Response>();
    const fetchMock = jest
      .fn()
      .mockReturnValueOnce(firstResponse.promise)
      .mockReturnValueOnce(secondResponse.promise)
      .mockReturnValueOnce(thirdResponse.promise);
    global.fetch = fetchMock as typeof fetch;

    const { generateMealImages } = await import("./image.service.js");
    const firstResult = generateMealImages([
      { name: "Pierwszy posilek", ingredients: [{ name: "ryz" }] },
    ]);
    const secondResult = generateMealImages([
      { name: "Drugi posilek", ingredients: [{ name: "kurczak" }] },
    ]);
    const thirdResult = generateMealImages([
      { name: "Trzeci posilek", ingredients: [{ name: "pomidor" }] },
    ]);

    await flushPromises();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    firstResponse.resolve(successfulImageResponse());
    await flushPromises();

    await jest.advanceTimersByTimeAsync(1500);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    secondResponse.resolve(successfulImageResponse());
    await flushPromises();

    await jest.advanceTimersByTimeAsync(1499);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    thirdResponse.resolve(successfulImageResponse());
    await expect(Promise.all([firstResult, secondResult, thirdResult])).resolves
      .toHaveLength(3);
  });
});
