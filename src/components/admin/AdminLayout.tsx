"use client";

import { ReactNode } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Archive,
  CreditCard,
  Percent,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  if (!isAuthenticated() || !admin) {
    router.push("/admin-login");
    return null;
  }

  const baseNavigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      current: pathname.startsWith("/admin/products"),
    },
    {
      name: "Inventory",
      href: "/admin/inventory",
      icon: Archive,
      current: pathname.startsWith("/admin/inventory"),
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      current: pathname.startsWith("/admin/categories"),
    },
    {
      name: "Discounts",
      href: "/admin/discounts",
      icon: Percent,
      current: pathname.startsWith("/admin/discounts"),
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      current: pathname.startsWith("/admin/transactions"),
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      current: pathname.startsWith("/admin/reports"),
    },
  ];

  // Add Users tab only for Super Admin
  const navigation = admin?.isSuper
    ? [
        ...baseNavigation,
        {
          name: "Users",
          href: "/admin/users",
          icon: Users,
          current: pathname.startsWith("/admin/users"),
        },
      ]
    : baseNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        item.current
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="mr-3 h-6 w-6" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Store Info */}
          <div className="mt-8 border-t px-4 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Store Access</h3>
            <div className="mt-2">
              {admin.store ? (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {admin.store.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {admin.store.city}, {admin.store.province}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-sm font-medium text-blue-900">
                    All Stores
                  </p>
                  <p className="text-xs text-blue-600">Super Admin Access</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
