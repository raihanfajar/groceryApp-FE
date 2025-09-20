import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import { AdminProductCategory } from "@/types/admin/product";
import Link from "next/link";

interface CategoryViewHeaderProps {
  category: AdminProductCategory;
  isSuper: boolean;
}

export default function CategoryViewHeader({
  category,
  isSuper,
}: CategoryViewHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/admin/categories">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600">Category Details</p>
        </div>
        <Badge variant={category.isActive ? "default" : "secondary"}>
          {category.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {isSuper && (
        <Link href={`/admin/categories/${category.slug}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Category
          </Button>
        </Link>
      )}
    </div>
  );
}
