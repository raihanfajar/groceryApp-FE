// components/TransactionFiltersCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStoreListQuery } from "@/hooks/admin/transaction/adminTransaction";
import { Search } from "lucide-react";
import React from "react";
import { StoreCombobox } from "./StoreComboBox";

export type TransactionFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string | undefined;
  storeId?: string;
};

interface TransactionFiltersProps {
  filters: TransactionFilters;
  isSuper: boolean;
  onSearch: (searchTerm: string) => void;
  onStatusChange: (status: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onStoreIdChange: (storeId: string) => void;
}

export default function TransactionListSearch({
  filters,
  isSuper,
  onSearch,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onStoreIdChange,
}: TransactionFiltersProps) {
  const { data: storeList } = useStoreListQuery({
    enabled: isSuper,
  });

  const storeOptions = React.useMemo(() => {
    return (
      storeList?.map((store) => ({
        value: store.id,
        label: store.name,
      })) || []
    );
  }, [storeList]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* Store Combobox */}
          {isSuper && (
            <div className="grid w-full items-center gap-1.5">
              <label className="text-sm font-medium">Filter by Store</label>
              <StoreCombobox
                options={storeOptions}
                value={filters.storeId || "all"}
                onChange={onStoreIdChange}
                placeholder="Select a store"
                searchPlaceholder="Search store..."
                emptyText="No store found."
              />
            </div>
          )}

          {/* Search orderId */}
          <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium">Search by Order ID</label>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
              <Input
                placeholder="Order ID..."
                value={filters.search ?? ""}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status dropdown */}
          <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium">Filter by Status</label>
            <Select
              value={filters.status === undefined ? "all" : filters.status}
              onValueChange={(v) => onStatusChange(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="waiting_payment">waiting_payment</SelectItem>
                <SelectItem value="waiting_confirmation">
                  waiting_confirmation
                </SelectItem>
                <SelectItem value="on_process">on_process</SelectItem>
                <SelectItem value="shipped">shipped</SelectItem>
                <SelectItem value="completed">completed</SelectItem>
                <SelectItem value="cancelled">cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* End Date */}
          <div className="grid w-full items-center gap-1.5">
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
