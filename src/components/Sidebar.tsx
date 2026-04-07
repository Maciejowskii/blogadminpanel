"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  ChevronLeft,
  Menu,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Clients",
    href: "/dashboard/clients",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl md:hidden cursor-pointer"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        <Menu className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out",
          "md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-20" : "w-64"
        )}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 h-16"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #818cf8)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span
                className="font-bold text-lg tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                BlogCMS
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center px-2"
                )}
                style={{
                  backgroundColor: active
                    ? "var(--accent-glow)"
                    : "transparent",
                  color: active ? "var(--accent-hover)" : "var(--text-secondary)",
                  border: active
                    ? "1px solid rgba(99, 102, 241, 0.2)"
                    : "1px solid transparent",
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full cursor-pointer",
              collapsed && "justify-center px-2"
            )}
            style={{ color: "var(--text-secondary)" }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
