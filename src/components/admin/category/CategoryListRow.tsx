import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProductCategory } from "@/types/admin/product";
import { Edit, Trash2, Eye, Package } from "lucide-react";
import { getIconById, getDefaultIcon } from "@/constants/categoryIcons";
import Link from "next/link";

interface CategoryListRowProps {
  category: AdminProductCategory;
  isSuper: boolean;
  onDelete: (id: string) => void;
}

export default function CategoryListRow({
  category,
  isSuper,
  onDelete,
}: CategoryListRowProps) {
  const categoryIcon = category.icon
    ? getIconById(category.icon) || getDefaultIcon()
    : getDefaultIcon();

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-lg border bg-white p-3 transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      {/* Icon */}
      <div
        className={`flex-shrink-0 rounded-lg bg-gray-100 p-2 ${categoryIcon.color}`}
      >
        <categoryIcon.icon size={20} />
      </div>

      {/* Category Info */}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-4">
        {/* Name & Description */}
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm font-semibold text-gray-900 sm:text-base"
            title={category.name}
          >
            {category.name}
          </h3>
          {category.description && (
            <p className="line-clamp-1 text-xs text-gray-600 sm:text-sm">
              {category.description}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="hidden w-32 flex-shrink-0 lg:block xl:w-40">
          <p
            className="truncate font-mono text-xs text-gray-500"
            title={category.slug}
          >
            {category.slug}
          </p>
        </div>

        {/* Product Count */}
        <div className="hidden w-24 flex-shrink-0 items-center gap-1 md:flex">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {category._count?.products || 0}
          </span>
        </div>

        {/* Created Date */}
        <div className="hidden w-28 flex-shrink-0 xl:block">
          <p className="text-xs text-gray-400">
            {new Date(category.createdAt).toLocaleDateString("id-ID")}
          </p>
        </div>

        {/* Status */}
        <div className="hidden w-16 flex-shrink-0 sm:block xl:w-20">
          <Badge
            variant={category.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-1 sm:gap-2">
          <Link href={`/admin/categories/${category.slug}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {isSuper && (
            <>
              <Link href={`/admin/categories/${category.slug}/edit`}>
                <Button size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
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
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
