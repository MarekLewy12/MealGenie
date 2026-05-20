import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { notify } from "../store/notificationStore";
import { cn } from "../utils/cn";
import { Logo } from "./Logo";

type AppSidebarProps = {
  onNavigate?: () => void;
};

type SidebarLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const sidebarLinks: SidebarLink[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: Home,
    end: true,
  },
  {
    to: "/generator",
    label: "Generator",
    icon: Wand2,
  },
  {
    to: "/recipes",
    label: "Przepisy",
    icon: BookOpen,
  },
  {
    to: "/settings",
    label: "Preferencje",
    icon: Settings,
  },
];

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "MG";

  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) return "MG";

  return parts
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const openGlobalChat = useChatStore((state) => state.openGlobalChat);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const initials = getInitials(user?.name, user?.email);
  const displayName = user?.name || "Kucharz";

  const handleOpenAssistant = () => {
    openGlobalChat();
    onNavigate?.();
  };

  const handleLogout = () => {
    logout();
    notify.info("Wylogowano pomyślnie.");
    setIsProfileMenuOpen(false);
    onNavigate?.();
    navigate("/");
  };

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-4">
      <Link
        to="/dashboard"
        onClick={onNavigate}
        aria-label="MealGenie - dashboard"
        className="mb-6 inline-flex rounded-lg px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
      >
        <Logo className="origin-left scale-90" />
      </Link>

      <nav aria-label="Główna nawigacja aplikacji" className="flex flex-col gap-6">
        <div>
          <p className="mb-3 px-3 font-brand text-[0.7rem] font-bold uppercase tracking-[0.13em] text-ink-muted">
            Menu
          </p>
          <div className="grid gap-1.5">
            {sidebarLinks.slice(0, 3).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex min-h-11 items-center gap-3 rounded-pill border px-3 py-2 text-[0.95rem] font-semibold transition duration-fast",
                    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
                    isActive
                      ? "border-accent/20 bg-accent-soft text-accent-deep shadow-xs"
                      : "border-transparent text-ink-soft hover:bg-bg-sunken hover:text-ink",
                  )
                }
              >
                <item.icon
                  className="h-[1.2rem] w-[1.2rem] shrink-0"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 px-3 font-brand text-[0.7rem] font-bold uppercase tracking-[0.13em] text-ink-muted">
            Narzędzia
          </p>
          <div className="grid gap-1.5">
            <button
              type="button"
              onClick={handleOpenAssistant}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-pill border border-transparent bg-bg-sunken px-3 py-2 text-left text-[0.95rem] font-semibold text-ink transition duration-fast",
                "hover:border-basil/20 hover:bg-basil-soft hover:text-basil focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
              )}
            >
              <MessageSquare
                className="h-[1.2rem] w-[1.2rem] shrink-0"
                aria-hidden="true"
              />
              <span>Czat z Asystentem</span>
            </button>

            {sidebarLinks.slice(3).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex min-h-11 items-center gap-3 rounded-pill border px-3 py-2 text-[0.95rem] font-semibold transition duration-fast",
                    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent",
                    isActive
                      ? "border-accent/20 bg-accent-soft text-accent-deep shadow-xs"
                      : "border-transparent text-ink-soft hover:bg-bg-sunken hover:text-ink",
                  )
                }
              >
                <item.icon
                  className="h-[1.2rem] w-[1.2rem] shrink-0"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative mt-auto border-t border-border pt-4">
        {isProfileMenuOpen && (
          <div
            role="menu"
            aria-label="Menu profilu"
            className="absolute bottom-full left-0 right-0 mb-3 rounded-lg border border-border bg-bg-elevated p-2 shadow-lg"
          >
            <Link
              to="/settings"
              role="menuitem"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onNavigate?.();
              }}
              className="flex min-h-10 items-center rounded-md px-3 py-2 text-[0.95rem] font-semibold text-ink-soft transition hover:bg-bg-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              Preferencje gotowania
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[0.95rem] font-semibold text-bordeaux transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Wyloguj się
            </button>
          </div>
        )}

        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
          onClick={() => setIsProfileMenuOpen((current) => !current)}
          className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-left shadow-xs transition duration-fast hover:border-accent/40 hover:bg-bg-sunken focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill bg-accent-soft font-brand text-[0.95rem] font-bold text-accent-deep">
            {initials}
          </span>

          <span className="min-w-0">
            <span className="block truncate font-brand text-[0.95rem] font-semibold text-ink">
              {displayName}
            </span>
            <span className="block truncate text-[0.8rem] text-ink-muted">
              Profil kulinarny
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
