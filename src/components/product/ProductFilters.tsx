import React, { useCallback, useMemo } from "react";
import { ChevronDown, Filter, X, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/product/useProducts";
import type { ProductFilters } from "@/types/product/productTypes";
import { SORT_OPTIONS } from "@/types/product/productTypes";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";

interface ProductFiltersComponentProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  className?: string;
  showMobileToggle?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ProductFiltersComponent: React.FC<
  ProductFiltersComponentProps
> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
  showMobileToggle = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data?.categories || [];

  // Price range bounds
  const MIN_PRICE = 0;
  const MAX_PRICE = 1000000; // 1M IDR
  const priceRange = [
    filters.minPrice || MIN_PRICE,
    filters.maxPrice || MAX_PRICE,
  ];

  // Handle filter updates
  const updateFilter = useCallback(
    (key: keyof ProductFilters, value: string | number | undefined) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange],
  );

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      updateFilter("minPrice", value[0] === MIN_PRICE ? undefined : value[0]);
      updateFilter("maxPrice", value[1] === MAX_PRICE ? undefined : value[1]);
    },
    [updateFilter],
  );

  // Handle category toggle
  const handleCategoryToggle = useCallback(
    (categoryId: string) => {
      updateFilter(
        "categoryId",
        filters.categoryId === categoryId ? undefined : categoryId,
      );
    },
    [filters.categoryId, updateFilter],
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (value: string) => {
      updateFilter("sortBy", value === "default" ? undefined : value);
    },
    [updateFilter],
  );

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.storeId) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters]);

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Sort By */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <Label className="text-xs font-medium">Sort By</Label>
        </div>
        <Select
          value={filters.sortBy || "default"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto w-full justify-between p-0"
          >
            <Label className="text-xs font-medium">Categories</Label>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categoryId === category.id}
                onCheckedChange={() => handleCategoryToggle(category.id)}
                className="h-3.5 w-3.5"
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer text-xs font-normal"
              >
                {category.name}
              </Label>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-muted-foreground text-xs">
              No categories available
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto w-full justify-between p-0"
          >
            <Label className="text-xs font-medium">Price Range</Label>
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-3">
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={MAX_PRICE}
              min={MIN_PRICE}
              step={10000}
              className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-[10px]">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </div>

          {/* Manual Price Input */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="min-price" className="text-[10px]">
                Min
              </Label>
              <Input
                id="min-price"
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-price" className="text-[10px]">
                Max
              </Label>
              <Input
                id="max-price"
                type="number"
                placeholder="1000000"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="h-7 text-xs"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-8 w-full text-xs"
            size="sm"
          >
            <X className="mr-1 h-3 w-3" />
            Clear ({activeFiltersCount})
          </Button>
        </>
      )}
    </div>
  );

  // Mobile version with toggle
  if (showMobileToggle) {
    return (
      <div className={cn("w-full", className)}>
        {/* Mobile Filter Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onToggleCollapse}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Collapsible Filters */}
        {!isCollapsed && (
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <FilterContent />
      </CardContent>
    </Card>
  );
};
