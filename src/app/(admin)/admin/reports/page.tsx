"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Package, DollarSign } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import DashboardOverview from "@/components/admin/reports/DashboardOverview";
import SalesReports from "@/components/admin/reports/SalesReports";
import StockReports from "@/components/admin/reports/StockReports";

export default function ReportsPage() {
  const { admin } = useAdminAuthStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    admin?.isSuper ? "all" : admin?.store?.id || "",
  );

  // Helper function to convert "all" to empty string for API calls
  const getStoreIdForApi = (storeId: string) => {
    return storeId === "all" ? "" : storeId;
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Reports & Analysis
          </h1>
          <p className="text-muted-foreground">
            View comprehensive reports and analytics for your store
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Sales Reports
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Stock Reports
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <DashboardOverview
            storeId={getStoreIdForApi(selectedStoreId)}
            month={selectedMonth}
            year={selectedYear}
            onStoreChange={setSelectedStoreId}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-6">
          <SalesReports
            storeId={getStoreIdForApi(selectedStoreId)}
            month={selectedMonth}
            year={selectedYear}
            onStoreChange={setSelectedStoreId}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </TabsContent>

        {/* Stock Reports Tab */}
        <TabsContent value="stock" className="space-y-6">
          <StockReports
            storeId={getStoreIdForApi(selectedStoreId)}
            month={selectedMonth}
            year={selectedYear}
            onStoreChange={setSelectedStoreId}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
