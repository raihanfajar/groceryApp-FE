import CategoryListHeader from "@/components/admin/category/CategoryListHeader";
import CategoryFiltersCard from "@/components/admin/category/CategoryFiltersCard";
import CategoryGrid from "@/components/admin/category/CategoryGrid";
import ViewToggle from "@/components/admin/product/ViewToggle";
import { AdminProductCategory, CategoryFilters } from "@/types/admin/product";

interface CategoriesTabContentProps {
  categories: AdminProductCategory[];
  categoriesLoading: boolean;
  categoryView: "grid" | "list";
  categoryFilters: CategoryFilters;
  isSuper: boolean;
  storeName?: string;
  onViewChange: (view: "grid" | "list") => void;
  onSearch: (search: string) => void;
  onActiveFilter: (isActive: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function CategoriesTabContent({
  categories,
  categoriesLoading,
  categoryView,
  categoryFilters,
  isSuper,
  storeName,
  onViewChange,
  onSearch,
  onActiveFilter,
  onDelete,
}: CategoriesTabContentProps) {
  return (
    <div className="space-y-6">
      <CategoryListHeader isSuper={isSuper} storeName={storeName} />

      <CategoryFiltersCard
        filters={categoryFilters}
        onSearch={onSearch}
        onActiveFilter={onActiveFilter}
      />

      <div className="flex justify-end">
        <ViewToggle view={categoryView} onViewChange={onViewChange} />
      </div>

      <CategoryGrid
        categories={categories}
        loading={categoriesLoading}
        isSuper={isSuper}
        view={categoryView}
        onDelete={onDelete}
      />
    </div>
  );
}
