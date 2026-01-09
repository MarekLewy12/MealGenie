import { Outlet, useLocation } from "react-router-dom";
import { DashboardBackLink } from "./DashboardBackLink";
import { ChatDrawer } from "./ChatDrawer";

export function AuthenticatedLayout() {
  const { pathname } = useLocation();
  const isRecipePath =
    pathname === "/recipe" || pathname.startsWith("/recipe/");
  const showBackLink = pathname !== "/dashboard" && !isRecipePath;

  return (
    <div className="relative">
      {showBackLink && (
        <div className="mx-auto max-w-screen-2xl px-6 pt-4 sm:pt-6">
          <DashboardBackLink />
        </div>
      )}
      <Outlet />
      <ChatDrawer />
    </div>
  );
}
