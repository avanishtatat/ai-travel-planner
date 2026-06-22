"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Compass, LayoutDashboard, LogOut, Plane, Route } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Trips",
      href: "/trips",
      icon: Route,
    },
    {
      label: "Plan Trip",
      href: "/trips/new",
      icon: Compass,
    },
  ];

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Plane className="h-5 w-5" />
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">
              VoyageMind AI
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">
              Smart travel planner
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-slate-100 p-1 md:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full text-slate-500 hover:text-slate-900 sm:inline-flex"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-indigo-100 text-sm font-bold text-indigo-700">
                {getInitial()}
              </AvatarFallback>
            </Avatar>

            <div className="max-w-32">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "traveler"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
        <nav className="grid grid-cols-3 gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center rounded-xl px-2 py-2 text-xs font-medium ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500"
                }`}
              >
                <Icon className="mb-1 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}