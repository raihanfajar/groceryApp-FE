import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFilters } from "@/types/admin/product";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
  filters: CategoryFilters;
  onSearch: (searchTerm: string) => void;
  onActiveFilter: (isActive: string) => void;
}

export default function CategoryFiltersCard({
  filters,
  onSearch,
  onActiveFilter,
}: CategoryFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={filters.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={
              filters.isActive === undefined
                ? "all"
                : filters.isActive.toString()
            }
            onValueChange={onActiveFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
