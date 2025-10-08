"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Download, TrendingUp, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReportSummaryCards from "@/components/admin/inventory/ReportSummaryCards";
import CategoryDistributionChart from "@/components/admin/inventory/CategoryDistributionChart";
import StockValueChart from "@/components/admin/inventory/StockValueChart";
// import LowStockAlertsSection from "@/components/admin/inventory/LowStockAlertsSection";
import { useInventoryReports } from "@/hooks/admin/useInventoryReports";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { Store } from "@/types/admin/inventory";
import { toast } from "react-toastify";

const InventoryReportsPage = () => {
  const { admin } = useAdminAuthStore();
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  const { data, isLoading, error, refetch } =
    useInventoryReports(selectedStoreId);

  // Load stores for Super Admin
  const loadStores = useCallback(async () => {
    if (!admin?.accessToken || !admin?.isSuper) return;

    try {
      setLoadingStores(true);
      const response = await adminInventoryAPI.getStores(admin.accessToken);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
      toast.error("Failed to load stores");
    } finally {
      setLoadingStores(false);
    }
  }, [admin?.accessToken, admin?.isSuper]);

  useEffect(() => {
    if (admin?.isSuper) {
      loadStores();
    } else if (admin?.store?.id) {
      // For store admins, automatically set their store
      setSelectedStoreId(admin.store.id);
      setLoadingStores(false);
    } else {
      setLoadingStores(false);
    }
  }, [admin, loadStores]);

  const handleRefresh = () => {
    refetch();
  };

  const handleExportReport = () => {
    // This would implement report export functionality
    console.log("Exporting inventory report...");
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="mb-4 text-red-600">
                  Failed to load inventory reports
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/admin/inventory">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Inventory
                </Button>
              </Link>
            </div>
            <h1 className="mt-2 text-3xl font-bold">Inventory Reports</h1>
            <p className="mt-1 text-gray-600">
              Comprehensive analytics and insights for your inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Store Selector for Super Admin */}
            {admin?.isSuper && (
              <Select
                value={selectedStoreId}
                onValueChange={setSelectedStoreId}
                disabled={loadingStores}
              >
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
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={handleExportReport} variant="default">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Show message if Super Admin hasn't selected a store */}
        {admin?.isSuper && !selectedStoreId ? (
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <div className="text-center">
                <p className="mb-2 text-lg font-medium text-gray-700">
                  Please select a store to view inventory reports
                </p>
                <p className="text-sm text-gray-500">
                  Use the store selector above to choose a store
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <ReportSummaryCards summary={data.summary} />

            {/* Analytics Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryDistributionChart
                data={data.categoryDistribution}
                isLoading={isLoading}
              />
              <StockValueChart
                data={data.stockValueByCategory}
                isLoading={isLoading}
              />
            </div>

            {/* Stock Alerts Section - Hide for now since types don't match */}
            {/* TODO: Create separate component for LowStockProduct display */}
          </>
        )}

        {/* Insights Section */}
        {(!admin?.isSuper || selectedStoreId) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights
                {admin?.isSuper && selectedStoreId === "all" && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (Across All Stores)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-900">
                    Inventory Health
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    {data.summary
                      ? data.summary.lowStockProducts > 10
                        ? "Multiple items need restocking attention"
                        : "Inventory levels are generally healthy"
                      : "Loading..."}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="font-medium text-green-900">
                    Stock Distribution
                  </h4>
                  <p className="mt-1 text-sm text-green-700">
                    {data.categoryDistribution.length > 0
                      ? `Covering ${data.categoryDistribution.length} product categories`
                      : "Loading distribution data..."}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <h4 className="font-medium text-orange-900">
                    Immediate Actions
                  </h4>
                  <p className="mt-1 text-sm text-orange-700">
                    {data.outOfStockProducts.length > 0
                      ? `${data.outOfStockProducts.length} items require immediate restocking`
                      : "No immediate stock actions required"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default InventoryReportsPage;
