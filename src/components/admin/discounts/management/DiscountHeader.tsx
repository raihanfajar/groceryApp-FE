import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Store } from "@/types/discount";

interface DiscountHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSuper: boolean;
  stores?: Store[];
  selectedStoreId: string;
  onStoreChange: (value: string) => void;
  onCreateClick: () => void;
}

export default function DiscountHeader({
  searchTerm,
  onSearchChange,
  isSuper,
  stores,
  selectedStoreId,
  onStoreChange,
  onCreateClick,
}: DiscountHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-4">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {isSuper && (
          <div className="min-w-[200px]">
            <Select
              value={selectedStoreId || "all"}
              onValueChange={(value) =>
                onStoreChange(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {(stores || []).map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name} - {store.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create Discount
      </Button>
    </div>
  );
}
