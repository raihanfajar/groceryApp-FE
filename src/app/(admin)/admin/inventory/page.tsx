"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import {
  InventorySummary,
  LowStockAlert,
  Store,
} from "@/types/admin/inventory";
import { toast } from "react-toastify";
import LowStockAlertsSection from "@/components/admin/inventory/LowStockAlertsSection";
import InventoryStatsCards from "@/components/admin/inventory/InventoryStatsCards";
import InventoryQuickActions from "@/components/admin/inventory/InventoryQuickActions";
import StockByCategoryCard from "@/components/admin/inventory/StockByCategoryCard";
import StoreInfoBanner from "@/components/admin/inventory/StoreInfoBanner";
import NoStoreAssignedError from "@/components/admin/inventory/NoStoreAssignedError";
import { useInventoryData } from "@/hooks/admin/useInventoryData";

export default function InventoryDashboard() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [inventorySummary, setInventorySummary] =
    useState<InventorySummary | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

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

  // Custom hook for loading inventory data
  const loadInventoryData = useInventoryData({
    adminToken: admin?.accessToken,
    isSuper: admin?.isSuper,
    selectedStoreId,
    setLoading,
    setInventorySummary,
    setLowStockAlerts,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }

    // Load stores for Super Admin and set default to "All Stores"
    if (admin?.isSuper) {
      loadStores();
      setSelectedStoreId("all");
    } else {
      // For store admins, use their assigned store
      if (admin?.store?.id) {
        setSelectedStoreId(admin.store.id);
      } else {
        console.warn("Store admin without assigned store");
      }
      setLoadingStores(false);
    }
  }, [isAuthenticated, router, admin, loadStores]);

  useEffect(() => {
    if (admin?.accessToken && selectedStoreId) {
      loadInventoryData();
    }
  }, [admin?.accessToken, selectedStoreId, loadInventoryData]);

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading inventory dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h2>
            <p className="text-gray-600">
              Manage stock levels, track movements, and monitor inventory across
              stores
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {admin.isSuper && (
              <Select
                value={selectedStoreId}
                onValueChange={setSelectedStoreId}
                disabled={loadingStores}
              >
                <SelectTrigger className="w-64">
                  <SelectValue
                    placeholder={
                      loadingStores ? "Loading stores..." : "Select a store..."
                    }
                  />
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
          </div>
        </div>

        {!admin.isSuper && !admin.store?.id ? (
          <NoStoreAssignedError />
        ) : (
          <>
            {/* Store Info Banner */}
            {admin.isSuper && (
              <StoreInfoBanner
                selectedStoreId={selectedStoreId}
                selectedStore={stores.find((s) => s.id === selectedStoreId)}
              />
            )}

            {/* Quick Stats */}
            <InventoryStatsCards summary={inventorySummary} loading={loading} />

            {/* Quick Actions */}
            <InventoryQuickActions
              selectedStoreId={selectedStoreId}
              isSuper={admin.isSuper}
            />

            {/* Low Stock Alerts & Stock by Category */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              {/* Low Stock Alerts */}
              <div className="lg:col-span-2">
                <LowStockAlertsSection
                  alerts={lowStockAlerts}
                  stores={stores}
                  isSuper={admin.isSuper}
                  showViewAll={true}
                />
              </div>

              {/* Category Breakdown */}
              <div className="lg:col-span-2">
                <StockByCategoryCard summary={inventorySummary} />
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
