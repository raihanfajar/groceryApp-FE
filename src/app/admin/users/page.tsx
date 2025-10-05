"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCog, Shield, Store } from "lucide-react";
import StoreAdminManagement from "@/components/admin/users/storeAdminManagement/StoreAdminManagement";
import UserDataManagement from "@/components/admin/users/UserDataManagement";
import StoreManagement from "@/components/admin/users/storeManagement/StoreManagement";

export default function UsersPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  // Redirect if not authenticated or not super admin
  if (!isAuthenticated() || !admin?.isSuper) {
    router.push("/admin/dashboard");
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="rounded-lg bg-blue-600 p-3">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage store admins and view user data
            </p>
          </div>
        </div>

        {/* Super Admin Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-blue-900">
              <Shield className="mr-2 h-5 w-5" />
              Super Admin Access
            </CardTitle>
            <CardDescription className="text-blue-700">
              You have full administrative privileges to manage store admins and
              view all user data.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="store-admins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stores" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span>Stores</span>
            </TabsTrigger>
            <TabsTrigger
              value="store-admins"
              className="flex items-center space-x-2"
            >
              <UserCog className="h-4 w-4" />
              <span>Store Admins</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>All Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stores">
            <Card>
              <CardHeader>
                <CardTitle>Store</CardTitle>
                <CardDescription>
                  Create, edit, and manage stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="store-admins">
            <Card>
              <CardHeader>
                <CardTitle>Store Admin Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage store administrator accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StoreAdminManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Data Overview</CardTitle>
                <CardDescription>
                  View all registered users and their information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserDataManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
