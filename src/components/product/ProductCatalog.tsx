import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Search, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { ProductSearch } from "@/components/product/ProductSearch";
import { ProductFiltersComponent } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";
import { useProducts, useCategories } from "@/hooks/product/useProducts";
import { ProductFilters, Product } from "@/types/product/productTypes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCatalogProps {
  className?: string;
  initialFilters?: Partial<ProductFilters>;
  onProductSelect?: (product: Product) => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  className,
  initialFilters = {},
  onProductSelect,
  showSearch = true,
  showFilters = true,
  showPagination = true,
}) => {
  // State
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    ...initialFilters,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update filters when initialFilters change (e.g., URL navigation)
  useEffect(() => {
    setFilters({
      page: 1,
      limit: 12,
      ...initialFilters,
    });
  }, [initialFilters]);

  // Fetch products and categories
  const { data, isLoading, error } = useProducts(filters);
  const { data: categoriesData } = useCategories();

  // Get current category info
  const currentCategory = useMemo(() => {
    if (!categoriesData?.data?.categories) return null;

    if (filters.categoryId) {
      return categoriesData.data.categories.find(
        (cat) => cat.id === filters.categoryId,
      );
    }

    if (filters.category) {
      return categoriesData.data.categories.find(
        (cat) => cat.slug === filters.category,
      );
    }

    return null;
  }, [filters.categoryId, filters.category, categoriesData]);

  // Handlers
  const handleFiltersChange = useCallback((newFilters: ProductFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to first page when filters change
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ page: 1, limit: filters.limit });
  }, [filters.limit]);

  const handleProductClick = useCallback(
    (product: Product) => {
      if (onProductSelect) {
        onProductSelect(product);
      } else {
        // Default behavior: navigate to product detail page
        window.location.href = `/products/${product.slug}`;
      }
    },
    [onProductSelect],
  );

  // Derived data
  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  };

  // Count active filters for mobile badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.storeId) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters]);

  return (
    <div className={cn("container mx-auto px-4 py-6", className)}>
      {/* Header with Search */}
      {showSearch && (
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-green-600">
              <Home className="mr-1 h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-green-600">
              Products
            </Link>
            {currentCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-green-600">
                  {currentCategory.name}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {currentCategory ? currentCategory.name : "Products"}
              </h1>
              <p className="text-muted-foreground">
                {currentCategory
                  ? `Browse ${currentCategory.name.toLowerCase()} products`
                  : filters.search
                    ? `Search results for "${filters.search}"`
                    : "Discover our wide range of grocery products"}
              </p>
              {currentCategory && (
                <Badge variant="secondary" className="mt-2">
                  {products.length} products available
                </Badge>
              )}
            </div>
            <div className="w-full max-w-md">
              <ProductSearch
                onSearchChange={handleSearchChange}
                placeholder="Search products..."
                showResults={false}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Desktop Filters Sidebar */}
        {showFilters && (
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-6">
              <ProductFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>
        )}

        {/* Products Section */}
        <main className="min-w-0 flex-1">
          {/* Mobile Filters */}
          {showFilters && (
            <div className="mb-6 lg:hidden">
              <Sheet
                open={isMobileFiltersOpen}
                onOpenChange={setIsMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFiltersComponent
                      filters={filters}
                      onFiltersChange={(newFilters) => {
                        handleFiltersChange(newFilters);
                        setIsMobileFiltersOpen(false);
                      }}
                      onClearFilters={() => {
                        handleClearFilters();
                        setIsMobileFiltersOpen(false);
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          {/* Products Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={!!error}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onProductClick={handleProductClick}
            showViewToggle={true}
          />

          {/* Pagination */}
          {showPagination && !isLoading && products.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={filters.limit || 12}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                showItemsPerPage={true}
                showInfo={true}
              />
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && products.length === 0 && filters.search && (
            <div className="py-12 text-center">
              <h3 className="mb-2 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
