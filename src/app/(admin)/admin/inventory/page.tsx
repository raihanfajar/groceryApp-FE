"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Archive,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Plus,
  ArrowLeftRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import {
  InventorySummary,
  LowStockAlert,
  Store,
} from "@/types/admin/inventory";
import { toast } from "react-toastify";

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
        // Store admin without assigned store - show error message
        console.warn("Store admin without assigned store");
      }
      setLoadingStores(false);
    }
  }, [isAuthenticated, router, admin, loadStores]);

  const loadInventoryData = useCallback(async () => {
    if (!admin?.accessToken) return;

    // Convert "all" to undefined for backend to aggregate all stores
    const storeIdForQuery =
      selectedStoreId === "all" ? undefined : selectedStoreId;

    try {
      setLoading(true);

      // Send storeId filter only if specific store is selected
      const filters =
        admin.isSuper && storeIdForQuery ? { storeId: storeIdForQuery } : undefined;

      const [summaryResponse, alertsResponse] = await Promise.all([
        adminInventoryAPI.getInventorySummary(admin.accessToken, filters),
        adminInventoryAPI.getLowStockAlerts(admin.accessToken, filters),
      ]);

      setInventorySummary(summaryResponse.data);
      setLowStockAlerts(alertsResponse.data);
    } catch (error) {
      console.error("Error loading inventory data:", error);

      // Check if it's an Axios error with response
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response: { data?: unknown; status?: number } }
        ).response;
        console.error("Error response:", response.data);
        console.error("Error status:", response.status);

        if (response.status === 403) {
          if (
            response.data &&
            typeof response.data === "object" &&
            "message" in response.data
          ) {
            const message = (response.data as { message: string }).message;
            if (message.includes("Store admin must be assigned to a store")) {
              toast.error(
                "Store admin account is not properly configured. Please contact your administrator to assign a store to your account.",
              );
            } else {
              toast.error(
                "Access denied. You may not have permission to view inventory data.",
              );
            }
          } else {
            toast.error(
              "Access denied. You may not have permission to view inventory data.",
            );
          }
        } else {
          toast.error("Failed to load inventory data");
        }
      } else {
        toast.error("Failed to load inventory data");
      }
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, admin?.isSuper, selectedStoreId]);

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

  const selectedStore = stores.find((store) => store.id === selectedStoreId);

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
          <Card>
            <CardContent className="flex h-64 items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Account Configuration Required
                </h3>
                <p className="mt-2 text-gray-600">
                  Your store admin account is not assigned to any store. Please
                  contact your administrator to complete your account setup.
                </p>
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Technical Details:</strong>
                    <br />
                    Store admin accounts require a store assignment in the
                    backend database. Your administrator needs to update your
                    user record with a valid storeId.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Store Info Banner */}
            {admin.isSuper && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedStoreId === "all"
                          ? "All Stores - Aggregated View"
                          : selectedStore?.name || "Store"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedStoreId === "all"
                          ? "Viewing inventory data across all stores"
                          : selectedStore
                            ? `${selectedStore.city}, ${selectedStore.province}`
                            : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-sm font-medium">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : inventorySummary?.totalProducts || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Active products in store
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Stock
                  </CardTitle>
                  <Archive className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : inventorySummary?.totalStock || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Units available
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Alerts
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {loading ? "..." : inventorySummary?.lowStockProducts || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Products below minimum
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recent Movements
                  </CardTitle>
                  <TrendingUp className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : inventorySummary?.recentMovements || 0}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    In the last 24 hours
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common inventory management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link
                    href={`/admin/inventory/stock${selectedStoreId ? `?storeId=${selectedStoreId}` : ""}`}
                  >
                    <Button className="w-full" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Update Stock
                    </Button>
                  </Link>

                  <Link href="/admin/inventory/journal">
                    <Button className="w-full" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      View History
                    </Button>
                  </Link>

                  {admin.isSuper && (
                    <Link href="/admin/inventory/transfer">
                      <Button className="w-full" variant="outline">
                        <ArrowLeftRight className="mr-2 h-4 w-4" />
                        Transfer Stock
                      </Button>
                    </Link>
                  )}

                  <Link href="/admin/inventory/reports">
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            {lowStockAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Low Stock Alerts</span>
                  </CardTitle>
                  <CardDescription>
                    Products that need immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lowStockAlerts.slice(0, 5).map((alert) => (
                      <div
                        key={`${alert.storeId}-${alert.productId}`}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                            {alert.product.picture1 ? (
                              <Image
                                src={alert.product.picture1}
                                alt={alert.product.name}
                                width={32}
                                height={32}
                                className="rounded object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {alert.product.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {alert.product.category.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            Stock:{" "}
                            <span className="text-red-600">{alert.stock}</span>{" "}
                            / {alert.minStock}
                          </p>
                          <p className="text-xs text-gray-500">
                            {alert.isOutOfStock ? "Out of Stock" : "Low Stock"}
                          </p>
                        </div>
                      </div>
                    ))}
                    {lowStockAlerts.length > 5 && (
                      <div className="text-center">
                        <Link href="/admin/inventory/reports">
                          <Button variant="outline" size="sm">
                            View All {lowStockAlerts.length} Alerts
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Category Breakdown */}
            {inventorySummary?.stockByCategory &&
              inventorySummary.stockByCategory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Stock by Category</CardTitle>
                    <CardDescription>
                      Inventory distribution across product categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {inventorySummary.stockByCategory.map((category) => (
                        <div
                          key={category.categoryId}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <h4 className="font-medium">
                              {category.categoryName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {category.productCount} products
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {category.totalStock}
                            </p>
                            <p className="text-xs text-gray-500">units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
