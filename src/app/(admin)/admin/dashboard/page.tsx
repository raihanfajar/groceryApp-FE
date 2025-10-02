"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
    }
  }, [isAuthenticated, router]);

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
    <AdminLayout>
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
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-muted-foreground text-xs">
              Manage your product catalog
            </p>
            <Link href="/admin/products">
              <Button size="sm" className="mt-2 w-full">
                Manage Products
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Available</div>
            <p className="text-muted-foreground text-xs">
              Organize your products
            </p>
            <Link href="/admin/categories">
              <Button size="sm" className="mt-2 w-full">
                Manage Categories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Analytics</div>
            <p className="text-muted-foreground text-xs">
              Business intelligence
            </p>
            <Link href="/admin/reports">
              <Button size="sm" className="mt-2 w-full">
                View Reports
              </Button>
            </Link>
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
              View comprehensive analytics and insights:
            </p>
            <ul className="mb-4 space-y-1 text-sm text-gray-600">
              <li>• Monthly sales summaries with KPIs</li>
              <li>• Category and product performance analysis</li>
              <li>• Stock movement tracking and trends</li>
              <li>• Low stock alerts and warnings</li>
              <li>• Interactive charts and visualizations</li>
            </ul>
            <Link href="/admin/reports">
              <Button className="w-full">View Reports & Analytics</Button>
            </Link>
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
            <Link className="mt-5" href={admin.isSuper ? "/admin/users" : "/"}>
              <Button size="sm" className="w-full">
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
