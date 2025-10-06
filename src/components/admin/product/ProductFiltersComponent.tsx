import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminProductCategory, ProductFilters } from "@/types/admin/product";
import { Search, Filter } from "lucide-react";

interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
}

interface ProductFiltersComponentProps {
  filters: ProductFilters;
  categories: AdminProductCategory[];
  stores?: Store[];
  isSuper: boolean;
  onSearch: (searchTerm: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onStoreFilter?: (storeId: string) => void;
}

const ProductFiltersComponent: React.FC<ProductFiltersComponentProps> = ({
  filters,
  categories,
  stores = [],
  isSuper,
  onSearch,
  onCategoryFilter,
  onStoreFilter,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-4">
          <div className="relative flex-1 md:max-w-[300px]">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={filters.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
            <Select
              value={filters.categoryId || "all"}
              onValueChange={onCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories &&
                  Array.isArray(categories) &&
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {isSuper && onStoreFilter && (
              <Select
                value={filters.storeId || "all"}
                onValueChange={onStoreFilter}
              >
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Select store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {stores &&
                    Array.isArray(stores) &&
                    stores.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFiltersComponent;
