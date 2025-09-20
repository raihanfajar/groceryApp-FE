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

interface ProductFiltersComponentProps {
  filters: ProductFilters;
  categories: AdminProductCategory[];
  isSuper: boolean;
  onSearch: (searchTerm: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onStoreFilter?: (storeId: string) => void;
}

const ProductFiltersComponent: React.FC<ProductFiltersComponentProps> = ({
  filters,
  categories,
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={filters.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.categoryId || "all"}
            onValueChange={onCategoryFilter}
          >
            <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {/* We'll need to add store options here */}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFiltersComponent;
