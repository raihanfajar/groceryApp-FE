import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, X } from "lucide-react";

interface Store {
  id: string;
  name: string;
}

interface ReportFilters {
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

interface ReportFiltersProps {
  filters: ReportFilters;
  isSuper: boolean;
  onStoreFilter: (storeId: string | undefined) => void;
  onDateRangeFilter: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  isSuper,
  onStoreFilter,
  onDateRangeFilter,
}) => {
  const stores: Store[] = []; // TODO: Implement stores API

  const hasActiveFilters =
    (isSuper && filters.storeId) || filters.startDate || filters.endDate;

  const clearFilters = () => {
    if (isSuper) {
      onStoreFilter(undefined);
    }
    onDateRangeFilter(undefined, undefined);
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Report Filters</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Store Filter (Super Admin only) */}
        {isSuper && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Store</label>
            <Select
              value={filters.storeId || "all"}
              onValueChange={(value) =>
                onStoreFilter(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Range Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                onDateRangeFilter(e.target.value || undefined, filters.endDate)
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">End Date</label>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                onDateRangeFilter(
                  filters.startDate,
                  e.target.value || undefined,
                )
              }
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
