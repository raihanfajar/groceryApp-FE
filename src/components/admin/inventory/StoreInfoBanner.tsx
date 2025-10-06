import { Card, CardContent } from "@/components/ui/card";
import { Store } from "@/types/admin/inventory";

interface StoreInfoBannerProps {
  selectedStoreId: string;
  selectedStore?: Store;
}

export default function StoreInfoBanner({
  selectedStoreId,
  selectedStore,
}: StoreInfoBannerProps) {
  return (
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
  );
}
