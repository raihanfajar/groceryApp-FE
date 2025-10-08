import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditDateAndLimitFieldsProps {
  startDate: string;
  endDate: string;
  totalUsageLimit?: number;
  maxUsagePerCustomer?: number;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onTotalUsageLimitChange: (value: number | undefined) => void;
  onMaxUsagePerCustomerChange: (value: number | undefined) => void;
}

export default function EditDateAndLimitFields({
  startDate,
  endDate,
  totalUsageLimit,
  maxUsagePerCustomer,
  onStartDateChange,
  onEndDateChange,
  onTotalUsageLimitChange,
  onMaxUsagePerCustomerChange,
}: EditDateAndLimitFieldsProps) {
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
