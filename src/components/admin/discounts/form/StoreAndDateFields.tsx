import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store } from "@/types/discount";

interface StoreSelectionProps {
  isSuper: boolean;
  stores?: Store[];
  selectedStoreId?: string;
  onStoreChange: (value?: string) => void;
}

export default function StoreSelection({
  isSuper,
  stores,
  selectedStoreId,
  onStoreChange,
}: StoreSelectionProps) {
  if (!isSuper) return null;

  const selectedStore = stores?.find((s) => s.id === selectedStoreId);

  return (
    <div className="space-y-2">
      <Label htmlFor="storeId">Target Store *</Label>
      <Select
        value={selectedStoreId || ""}
        onValueChange={(value) =>
          onStoreChange(value === "global" ? undefined : value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select target store" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">🌍 Global (All Stores)</SelectItem>
          {(stores || []).map((store) => (
            <SelectItem key={store.id} value={store.id}>
              🏪 {store.name} - {store.city}, {store.province}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-gray-600">
        {selectedStoreId
          ? `Discount will apply to ${selectedStore?.name || "selected store"} only`
          : selectedStoreId === undefined && isSuper
            ? "Discount will apply to all stores globally"
            : "Please select where this discount should be applied"}
      </p>
    </div>
  );
}

interface DateAndLimitFieldsProps {
  startDate: string;
  endDate: string;
  totalUsageLimit?: number;
  maxUsagePerCustomer?: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onTotalUsageLimitChange: (value?: number) => void;
  onMaxUsagePerCustomerChange: (value?: number) => void;
}

export function DateAndLimitFields({
  startDate,
  endDate,
  totalUsageLimit,
  maxUsagePerCustomer,
  onStartDateChange,
  onEndDateChange,
  onTotalUsageLimitChange,
  onMaxUsagePerCustomerChange,
}: DateAndLimitFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
          <Input
            id="totalUsageLimit"
            type="number"
            value={totalUsageLimit || ""}
            onChange={(e) =>
              onTotalUsageLimitChange(parseInt(e.target.value) || undefined)
            }
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsagePerCustomer">Max Usage Per Customer</Label>
          <Input
            id="maxUsagePerCustomer"
            type="number"
            value={maxUsagePerCustomer || ""}
            onChange={(e) =>
              onMaxUsagePerCustomerChange(parseInt(e.target.value) || undefined)
            }
            min="1"
          />
        </div>
      </div>
    </>
  );
}
