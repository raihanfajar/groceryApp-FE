import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CategoryListHeaderProps {
  isSuper: boolean;
  storeName?: string;
}

export default function CategoryListHeader({
  isSuper,
  storeName,
}: CategoryListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Category Management
        </h1>
        <p className="text-gray-600">
          {isSuper
            ? "Manage product categories across all stores"
            : `View categories for ${storeName}`}
        </p>
      </div>
      {isSuper && (
        <Link href="/admin/categories/create">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
