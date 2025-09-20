"use client";

import { ReactNode } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Shield,
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  BarChart3,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, logout, isAuthenticated, isSuperAdmin } = useAdminAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  if (!isAuthenticated() || !admin) {
    router.push("/admin-login");
    return null;
  }

  const navigation = [
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
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      current: pathname.startsWith("/admin/categories"),
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      current: pathname.startsWith("/admin/reports"),
      disabled: true,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname.startsWith("/admin/users"),
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-600 p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  FreshNear Admin
                </h1>
                <p className="text-sm text-gray-500">Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {admin.name}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant={admin.isSuper ? "default" : "secondary"}>
                    {admin.isSuper ? "Super Admin" : "Store Admin"}
                  </Badge>
                  {admin.store && (
                    <Badge variant="outline" className="text-xs">
                      {admin.store.name}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    {item.disabled ? (
                      <div className="flex cursor-not-allowed items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-400">
                        <Icon className="mr-3 h-6 w-6" />
                        {item.name}
                        <Badge variant="outline" className="ml-auto text-xs">
                          Soon
                        </Badge>
                      </div>
                    ) : (
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
                    )}
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
