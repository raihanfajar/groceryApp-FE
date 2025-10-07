import ProductListingHeader from "@/components/admin/product/ProductListingHeader";
import ProductFiltersComponent from "@/components/admin/product/ProductFiltersComponent";
import ProductCard from "@/components/admin/product/ProductCard";
import ProductListRow from "@/components/admin/product/ProductListRow";
import ProductEmptyState from "@/components/admin/product/ProductEmptyState";
import ProductPagination from "@/components/admin/product/ProductPagination";
import ViewToggle from "@/components/admin/product/ViewToggle";
import LoadingLogo from "@/components/ui/LoadingLogo";
import { AdminProduct, AdminProductCategory } from "@/types/admin/product";
import { Store } from "@/types/admin/inventory";

interface ProductsTabContentProps {
  products: AdminProduct[];
  categories: AdminProductCategory[];
  stores: Store[];
  loading: boolean;
  filters: {
    search?: string;
    categoryId?: string;
    storeId?: string;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  productView: "grid" | "list";
  isSuper: boolean;
  storeName?: string;
  onViewChange: (view: "grid" | "list") => void;
  onSearch: (search: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onStoreFilter: (storeId: string) => void;
  onPageChange: (page: number) => void;
  onDeleteProduct: (id: string) => Promise<void>;
}

export default function ProductsTabContent({
  products,
  categories,
  stores,
  loading,
  filters,
  pagination,
  productView,
  isSuper,
  storeName,
  onViewChange,
  onSearch,
  onCategoryFilter,
  onStoreFilter,
  onPageChange,
  onDeleteProduct,
}: ProductsTabContentProps) {
  return (
    <div className="space-y-6">
      <ProductListingHeader isSuper={isSuper} storeName={storeName} />

      <ProductFiltersComponent
        filters={filters}
        categories={categories}
        stores={stores}
        isSuper={isSuper}
        onSearch={onSearch}
        onCategoryFilter={onCategoryFilter}
        onStoreFilter={onStoreFilter}
      />

      <div className="flex justify-end">
        <ViewToggle view={productView} onViewChange={onViewChange} />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingLogo size="md" message="Loading products..." />
        </div>
      ) : products.length === 0 ? (
        <ProductEmptyState isSuper={isSuper} />
      ) : productView === "grid" ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSuper={isSuper}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <ProductListRow
              key={product.id}
              product={product}
              isSuper={isSuper}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}

      <ProductPagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
}
