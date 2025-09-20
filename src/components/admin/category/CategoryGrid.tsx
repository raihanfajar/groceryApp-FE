import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminProductCategory } from "@/types/admin/product";
import { FolderTree } from "lucide-react";
import Link from "next/link";
import CategoryCard from "./CategoryCard";

interface CategoryGridProps {
  categories: AdminProductCategory[];
  loading: boolean;
  isSuper: boolean;
  onDelete: (id: string) => void;
}

export default function CategoryGrid({
  categories,
  loading,
  isSuper,
  onDelete,
}: CategoryGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">No categories found</p>
          {isSuper && (
            <Link href="/admin/categories/create">
              <Button className="mt-4">Create your first category</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          isSuper={isSuper}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
