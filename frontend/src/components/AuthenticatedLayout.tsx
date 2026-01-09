import { Outlet } from "react-router-dom";
import { DashboardBackLink } from "./DashboardBackLink";

export function AuthenticatedLayout() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-screen-2xl px-6 pt-4 sm:pt-6">
        <DashboardBackLink />
      </div>
      <Outlet />
    </div>
  );
}
