import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import { Store } from "@/types/admin/inventory";

interface StoreSelectorProps {
  stores: Store[];
  fromStoreId: string;
  toStoreId: string;
  loadingStores: boolean;
  onFromStoreChange: (storeId: string) => void;
  onToStoreChange: (storeId: string) => void;
}

export default function StoreSelector({
  stores,
  fromStoreId,
  toStoreId,
  loadingStores,
  onFromStoreChange,
  onToStoreChange,
}: StoreSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fromStore">
          From Store <span className="text-red-500">*</span>
        </Label>
        <Select
          value={fromStoreId}
          onValueChange={onFromStoreChange}
          disabled={loadingStores}
        >
          <SelectTrigger id="fromStore" className="w-full">
            <SelectValue
              placeholder={
                loadingStores ? "Loading stores..." : "Select source store"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-w-[400px]">
            {stores
              .filter((store) => store.id !== toStoreId)
              .map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="h-4 w-4 flex-shrink-0 text-gray-500" />
                    <span className="truncate">
                      {store.name} - {store.city}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="toStore">
          To Store <span className="text-red-500">*</span>
        </Label>
        <Select
          value={toStoreId}
          onValueChange={onToStoreChange}
          disabled={loadingStores}
        >
          <SelectTrigger id="toStore" className="w-full">
            <SelectValue
              placeholder={
                loadingStores ? "Loading stores..." : "Select destination store"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-w-[400px]">
            {stores
              .filter((store) => store.id !== fromStoreId)
              .map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Building2 className="h-4 w-4 flex-shrink-0 text-gray-500" />
                    <span className="truncate">
                      {store.name} - {store.city}
                    </span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
