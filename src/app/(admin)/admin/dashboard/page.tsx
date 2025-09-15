"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Package,
  Users,
  LogOut,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin-login");
  };

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {admin.name}!
          </h2>
          <p className="text-gray-600">
            {admin.isSuper
              ? "You have access to all stores and system-wide analytics."
              : `Managing ${admin.store?.name} in ${admin.store?.city}, ${admin.store?.province}`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sales Reports
              </CardTitle>
              <BarChart3 className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-muted-foreground text-xs">
                Monthly sales analytics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Package className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-muted-foreground text-xs">
                Stock management reports
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-muted-foreground text-xs">
                Business intelligence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertCircle className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-muted-foreground text-xs">
                Active notifications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Report & Analysis</span>
              </CardTitle>
              <CardDescription>
                Access comprehensive sales and stock reports with business
                intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                The Report & Analysis system is ready on the backend! Features
                include:
              </p>
              <ul className="mb-4 space-y-1 text-sm text-gray-600">
                <li>• Monthly sales summaries with KPIs</li>
                <li>• Category and product performance analysis</li>
                <li>• Stock movement tracking and trends</li>
                <li>• Low stock alerts and warnings</li>
                <li>• Role-based access control</li>
              </ul>
              <Button className="w-full" disabled>
                Launch Reports (Frontend Integration Needed)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                {admin.isSuper
                  ? "Manage users and store administrators across all locations"
                  : "View customer information for your store"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-gray-600">
                User management capabilities:
              </p>
              <ul className="mb-4 space-y-1 text-sm text-gray-600">
                <li>• View customer accounts and activity</li>
                {admin.isSuper && (
                  <>
                    <li>• Create and manage store administrators</li>
                    <li>• System-wide user analytics</li>
                  </>
                )}
                <li>• Customer support tools</li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Admin Profile</CardTitle>
            <CardDescription>Current session information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="text-gray-900">{admin.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-900">{admin.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="text-gray-900">
                  {admin.isSuper
                    ? "Super Administrator"
                    : "Store Administrator"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Store Assignment
                </label>
                <p className="text-gray-900">
                  {admin.store
                    ? `${admin.store.name} (${admin.store.city}, ${admin.store.province})`
                    : "All Stores"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
