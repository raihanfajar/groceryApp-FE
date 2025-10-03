"use client";

import { useEffect } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiscountManagement from "@/components/admin/discounts/DiscountManagement";
import DiscountHistory from "@/components/admin/discounts/DiscountHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Percent, History } from "lucide-react";
import LoadingLogo from "@/components/ui/LoadingLogo";

export default function DiscountsPage() {
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
        <LoadingLogo size="lg" message="Loading discount management..." />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Discount Management
            </h1>
            <p className="mt-1 text-gray-600">
              Manage discounts, promotions, and special offers for your store
            </p>
          </div>
        </div>

        <Card>
          <CardContent>
            <Tabs defaultValue="manage" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="manage"
                  className="flex items-center space-x-2"
                >
                  <Percent className="h-4 w-4" />
                  <span>Manage Discounts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center space-x-2"
                >
                  <History className="h-4 w-4" />
                  <span>Usage History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manage">
                <DiscountManagement />
              </TabsContent>

              <TabsContent value="history">
                <DiscountHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
