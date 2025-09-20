import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProductCategory } from "@/types/admin/product";
import { Edit, Trash2, Eye, Package } from "lucide-react";
import { getIconById, getDefaultIcon } from "@/constants/categoryIcons";
import Link from "next/link";

interface CategoryCardProps {
  category: AdminProductCategory;
  isSuper: boolean;
  onDelete: (id: string) => void;
}

export default function CategoryCard({
  category,
  isSuper,
  onDelete,
}: CategoryCardProps) {
  const categoryIcon = category.icon
    ? getIconById(category.icon) || getDefaultIcon()
    : getDefaultIcon();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`rounded-lg bg-gray-100 p-2 ${categoryIcon.color}`}
              >
                <categoryIcon.icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
            </div>
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {category.description && (
            <p className="line-clamp-2 text-sm text-gray-600">
              {category.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>{category._count?.products || 0} products</span>
            </div>
            <span className="font-mono text-xs">{category.slug}</span>
          </div>

          <div className="text-xs text-gray-400">
            Created: {new Date(category.createdAt).toLocaleDateString("id-ID")}
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Link href={`/admin/categories/${category.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </Link>

          {isSuper && (
            <>
              <Link
                href={`/admin/categories/${category.slug}/edit`}
                className="flex-1"
              >
                <Button size="sm" className="w-full">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(category.id)}
                disabled={
                  !!(category._count?.products && category._count.products > 0)
                }
                title={
                  category._count?.products && category._count.products > 0
                    ? "Cannot delete category with products"
                    : "Delete category"
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
