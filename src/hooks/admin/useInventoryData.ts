import { useCallback } from "react";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { InventorySummary, LowStockAlert } from "@/types/admin/inventory";
import { toast } from "react-toastify";

interface UseInventoryDataParams {
  adminToken?: string;
  isSuper?: boolean;
  selectedStoreId: string;
  setLoading: (loading: boolean) => void;
  setInventorySummary: (summary: InventorySummary | null) => void;
  setLowStockAlerts: (alerts: LowStockAlert[]) => void;
}

export function useInventoryData({
  adminToken,
  isSuper,
  selectedStoreId,
  setLoading,
  setInventorySummary,
  setLowStockAlerts,
}: UseInventoryDataParams) {
  return useCallback(async () => {
    if (!adminToken) return;

    // Convert "all" to undefined for backend to aggregate all stores
    const storeIdForQuery =
      selectedStoreId === "all" ? undefined : selectedStoreId;

    try {
      setLoading(true);

      // Send storeId filter only if specific store is selected
      const filters =
        isSuper && storeIdForQuery ? { storeId: storeIdForQuery } : undefined;

      const [summaryResponse, alertsResponse] = await Promise.all([
        adminInventoryAPI.getInventorySummary(adminToken, filters),
        adminInventoryAPI.getLowStockAlerts(adminToken, filters),
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
  }, [
    adminToken,
    isSuper,
    selectedStoreId,
    setLoading,
    setInventorySummary,
    setLowStockAlerts,
  ]);
}
