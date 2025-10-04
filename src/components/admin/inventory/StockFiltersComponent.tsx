import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { AdminProductCategory } from "@/types/admin/product";

interface Store {
  id: string;
  name: string;
}

interface StockFilters {
  search?: string;
  categoryId?: string;
  storeId?: string;
  lowStockOnly?: boolean;
  sortBy?: "stock-asc" | "stock-desc";
}

interface StockFiltersComponentProps {
  filters: StockFilters;
  categories: AdminProductCategory[];
  stores: Store[];
  isSuper: boolean;
  onSearch: (query: string) => void;
  onCategoryFilter: (categoryId: string | undefined) => void;
  onStoreFilter: (storeId: string | undefined) => void;
  onSortChange: (sortBy: "stock-asc" | "stock-desc" | undefined) => void;
}

const StockFiltersComponent: React.FC<StockFiltersComponentProps> = ({
  filters,
  categories,
  stores,
  isSuper,
  onSearch,
  onCategoryFilter,
  onStoreFilter,
  onSortChange,
}) => {
  // Check for active filters (excluding storeId for Super Admin since it defaults to "all")
  const hasActiveFilters =
    filters.search || filters.categoryId || filters.sortBy;

  const clearFilters = () => {
    onSearch("");
    onCategoryFilter(undefined);
    onSortChange(undefined);
    if (isSuper) {
      onStoreFilter(undefined);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter Products</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="block h-5 text-sm font-medium text-gray-700">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search by product name..."
              value={filters.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block h-5 text-sm font-medium text-gray-700">
            Category
          </label>
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(value) =>
              onCategoryFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stock Count Sort */}
        <div className="space-y-2">
          <label className="block h-5 text-sm font-medium text-gray-700">
            Stock Count
          </label>
          <Select
            value={filters.sortBy || "none"}
            onValueChange={(value) =>
              onSortChange(
                value === "none"
                  ? undefined
                  : (value as "stock-asc" | "stock-desc"),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Sorting</SelectItem>
              <SelectItem value="stock-asc">Ascending (Low to High)</SelectItem>
              <SelectItem value="stock-desc">
                Descending (High to Low)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Store Filter (Super Admin only) */}
        {isSuper ? (
          <div className="space-y-2">
            <label className="block h-5 text-sm font-medium text-gray-700">
              Store
            </label>
            <Select
              value={filters.storeId || "all"}
              onValueChange={(value) =>
                onStoreFilter(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full">
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
        ) : (
          <div className="space-y-2">
            {/* Empty placeholder to maintain grid structure for store admins */}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockFiltersComponent;
