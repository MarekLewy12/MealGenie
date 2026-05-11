import { Link, type LinkProps } from "react-router-dom";

import { cn } from "../../../utils/cn";

type LandingCtaVariant = "primary" | "secondary";

type LandingCtaLinkProps = LinkProps & {
  variant?: LandingCtaVariant;
};

const baseClassName =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border px-5 py-3 text-center text-sm font-semibold leading-tight transition duration-slow ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:leading-none";

const variantClassNames: Record<LandingCtaVariant, string> = {
  primary:
    "group border-accent bg-accent text-ink-inverse shadow-accent hover:-translate-y-1 hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_20px_46px_-28px_rgba(232,111,69,0.85)] active:border-accent-pressed active:bg-accent-pressed",
  secondary:
    "border-border-strong bg-transparent text-accent hover:-translate-y-0.5 hover:border-accent hover:text-accent-deep active:bg-bg-sunken",
};

export function LandingCtaLink({
  variant = "primary",
  className,
  ...props
}: LandingCtaLinkProps) {
  return (
    <Link
      className={cn(baseClassName, variantClassNames[variant], className)}
      {...props}
    />
  );
}
