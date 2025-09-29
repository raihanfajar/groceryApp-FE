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
import { Search } from "lucide-react";
import React from "react";

export type TransactionFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string | undefined;
};

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onSearch: (searchTerm: string) => void;
  onStatusChange: (status: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function TransactionListSearch({
  filters,
  onSearch,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
}: TransactionFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          {/* Search orderId */}
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search order id..."
              value={filters.search ?? ""}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Start Date */}
          <div
            onClick={(e) => {
              const input = e.currentTarget.querySelector("input");
              input?.showPicker?.();
              input?.focus();
            }}
          >
            <Input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full cursor-pointer bg-transparent outline-none"
            />
          </div>

          {/* End Date */}
          <div
            onClick={(e) => {
              const input = e.currentTarget.querySelector("input");
              input?.showPicker?.();
              input?.focus();
            }}
          >
            <Input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full cursor-pointer bg-transparent outline-none"
            />
          </div>

          {/* Status dropdown */}
          <Select
            value={filters.status === undefined ? "all" : filters.status}
            onValueChange={(v) => onStatusChange(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
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
      </CardContent>
    </Card>
  );
}
