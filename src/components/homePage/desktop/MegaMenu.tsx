import Link from "next/link";
import { useCategories } from "@/hooks/product/useProducts";
import { MegaMenuProps } from "../typesAndInterfaces";
import { getCategorySlug } from "@/utils/slug";
import CategoryIcon from "@/components/ui/CategoryIcon";
import { useEffect } from "react";

export default function MegaMenu({
  isOpen,
  handleMouseEnter,
  handleMouseLeave,
}: Pick<MegaMenuProps, "isOpen" | "handleMouseEnter" | "handleMouseLeave">) {
  // Fetch real product categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    refetch,
  } = useCategories();
  const realCategories = categoriesData?.data?.categories || [];

  // Refetch categories when menu opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute top-full left-0 z-50 mt-6 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
    >
      {/* Categories List */}
      <div className="max-h-80 overflow-y-auto">
        {categoriesLoading ? (
          <div className="space-y-2 px-4 py-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 animate-pulse rounded bg-gray-200"
              ></div>
            ))}
          </div>
        ) : (
          <ul className="py-2">
            {realCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.slug || getCategorySlug(category.name)}`}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-green-50"
                >
                  <CategoryIcon
                    iconId={category.icon}
                    size={16}
                    showBackground={false}
                  />
                  <span className="text-gray-700">{category.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-3">
        <Link
          href="/products"
          className="text-xs font-medium text-green-600 hover:text-green-800"
        >
          View All Products →
        </Link>
      </div>
    </div>
  );
}
