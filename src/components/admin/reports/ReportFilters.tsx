"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useStores } from "@/hooks/admin/useStores";
import { Calendar } from "lucide-react";

interface ReportFiltersProps {
  storeId?: string;
  month: number;
  year: number;
  onStoreChange: (storeId: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  showStoreFilter?: boolean;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }
  return years;
};

export default function ReportFilters({
  storeId,
  month,
  year,
  onStoreChange,
  onMonthChange,
  onYearChange,
  showStoreFilter = true,
}: ReportFiltersProps) {
  const { admin } = useAdminAuthStore();
  const years = generateYears();
  const { data: stores, isLoading: isLoadingStores } = useStores();

  // If admin is not super, don't show store filter
  const shouldShowStoreFilter = showStoreFilter && admin?.isSuper;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Month Filter */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="month-select" className="text-xs">
              Month
            </Label>
            <Select
              value={month.toString()}
              onValueChange={(value) => onMonthChange(parseInt(value))}
            >
              <SelectTrigger id="month-select" className="w-[150px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="year-select" className="text-xs">
              Year
            </Label>
            <Select
              value={year.toString()}
              onValueChange={(value) => onYearChange(parseInt(value))}
            >
              <SelectTrigger id="year-select" className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Store Filter (only for super admin) */}
          {shouldShowStoreFilter && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="store-select" className="text-xs">
                Store
              </Label>
              <Select
                value={storeId || "all"}
                onValueChange={onStoreChange}
                disabled={isLoadingStores}
              >
                <SelectTrigger id="store-select" className="w-[200px]">
                  <SelectValue
                    placeholder={isLoadingStores ? "Loading..." : "All stores"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All stores</SelectItem>
                  {stores && stores.length > 0 ? (
                    stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </SelectItem>
                    ))
                  ) : !isLoadingStores ? (
                    <SelectItem value="no-stores" disabled>
                      No stores available
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
