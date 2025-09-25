import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Calendar } from "lucide-react";
import { AdminProduct, AdminProductCategory } from "@/types/admin/product";
import { StockMovementType } from "@/types/admin/inventory";

interface Store {
  id: string;
  name: string;
}

interface StockJournalFilters {
  search?: string;
  productId?: string;
  categoryId?: string;
  storeId?: string;
  type?: StockMovementType;
  startDate?: string;
  endDate?: string;
}

interface StockJournalFiltersProps {
  filters: StockJournalFilters;
  products: AdminProduct[];
  categories: AdminProductCategory[];
  stores: Store[];
  isSuper: boolean;
  onSearch: (query: string) => void;
  onProductFilter: (productId: string | undefined) => void;
  onCategoryFilter: (categoryId: string | undefined) => void;
  onStoreFilter: (storeId: string | undefined) => void;
  onTypeFilter: (type: StockMovementType | undefined) => void;
  onDateRangeFilter: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => void;
}

const movementTypes: { value: StockMovementType; label: string }[] = [
  { value: "IN", label: "Stock Increase" },
  { value: "OUT", label: "Stock Decrease" },
  { value: "ADJUSTMENT", label: "Adjustment" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "INITIAL", label: "Initial Stock" },
];

const StockJournalFilters: React.FC<StockJournalFiltersProps> = ({
  filters,
  products,
  categories,
  stores,
  isSuper,
  onSearch,
  onProductFilter,
  onCategoryFilter,
  onStoreFilter,
  onTypeFilter,
  onDateRangeFilter,
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.productId ||
    filters.categoryId ||
    (isSuper && filters.storeId) ||
    filters.type ||
    filters.startDate ||
    filters.endDate;

  const clearFilters = () => {
    onSearch("");
    onProductFilter(undefined);
    onCategoryFilter(undefined);
    if (isSuper) {
      onStoreFilter(undefined);
    }
    onTypeFilter(undefined);
    onDateRangeFilter(undefined, undefined);
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter Stock Movements</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search by product or notes..."
              value={filters.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Product Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Product</label>
          <Select
            value={filters.productId || "all"}
            onValueChange={(value) =>
              onProductFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select
            value={filters.categoryId || "all"}
            onValueChange={(value) =>
              onCategoryFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
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

        {/* Movement Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Movement Type
          </label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onTypeFilter(
                value === "all" ? undefined : (value as StockMovementType),
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {movementTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Second row of filters */}
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

export default StockJournalFilters;
