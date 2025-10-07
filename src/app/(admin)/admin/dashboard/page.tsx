"use client";

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { useDashboardData, useStores } from "@/hooks/admin/useDashboardData";

// Dashboard Components
import DailySalesCard from "@/components/admin/dashboard/DailySalesCard";
import MonthlySalesCard from "@/components/admin/dashboard/MonthlySalesCard";
import MonthlyTransactionsCard from "@/components/admin/dashboard/MonthlyTransactionsCard";
import TotalProductsCard from "@/components/admin/dashboard/TotalProductsCard";
import SalesGraphCard from "@/components/admin/dashboard/SalesGraphCard";
import TopSellingProductsCard from "@/components/admin/dashboard/TopSellingProductsCard";
import RecentTransactionsCard from "@/components/admin/dashboard/RecentTransactionsCard";
import LowStockAlertsSection from "@/components/admin/inventory/LowStockAlertsSection";

export default function AdminDashboard() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const { stores } = useStores();

  // Use dashboard data hook
  // Pass undefined for "all" stores to let backend aggregate all data
  // Pass selectedStoreId as-is to track whether Super Admin has made a selection
  const storeIdForQuery =
    selectedStoreId === "all" ? undefined : selectedStoreId;
  const {
    stats,
    salesChartData,
    topProducts,
    recentTransactions,
    lowStockAlerts,
    isLoading,
    refetch,
    period,
  } = useDashboardData(storeIdForQuery, selectedStoreId);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, router]);

  // Auto-select default for both admin types
  useEffect(() => {
    if (admin) {
      if (admin.isSuper) {
        // Set "All Stores" as default for Super Admin
        setSelectedStoreId("all");
      } else if (admin.store?.id) {
        // Set assigned store for Store Admin
        setSelectedStoreId(admin.store.id);
      }
    }
  }, [admin]);

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
      {/* Header with Store Selector */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {admin.name}!
          </h2>
          <p className="mt-1 text-gray-600">
            {admin.isSuper
              ? "Monitor performance across all stores"
              : `${admin.store?.name} - ${admin.store?.city}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Store Selector for Super Admin */}
          {admin.isSuper && (
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name} - {store.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Refresh Button */}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Show message if Super Admin hasn't selected store */}
      {admin.isSuper && !selectedStoreId ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              Select a store to view dashboard
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Choose a store from the dropdown above or select &quot;All
              Stores&quot;
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1: Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DailySalesCard amount={stats.dailySales} isLoading={isLoading} />
            <MonthlySalesCard
              amount={stats.monthlySales}
              period={period}
              isLoading={isLoading}
            />
            <MonthlyTransactionsCard
              count={stats.monthlyTransactions}
              period={period}
              isLoading={isLoading}
            />
            <TotalProductsCard
              count={stats.totalProducts}
              isLoading={isLoading}
            />
          </div>

          {/* Row 2: Sales Graph & Top Products */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-8">
            <div className="lg:col-span-5">
              <SalesGraphCard
                labels={salesChartData.labels}
                data={salesChartData.data}
                isLoading={isLoading}
              />
            </div>
            <div className="lg:col-span-3">
              <TopSellingProductsCard
                products={topProducts}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Row 3: Recent Transactions & Low Stock Alerts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentTransactionsCard
              transactions={recentTransactions}
              isLoading={isLoading}
            />
            <LowStockAlertsSection
              alerts={lowStockAlerts}
              stores={stores}
              isSuper={admin.isSuper}
              showViewAll={true}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
