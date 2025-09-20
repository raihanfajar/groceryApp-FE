import React from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product/productTypes";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;
  className?: string;
  onProductClick?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  isError = false,
  viewMode = "grid",
  onViewModeChange,
  showViewToggle = true,
  className,
  onProductClick,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        {showViewToggle && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Products</h2>
            <ProductViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        )}
        <ProductGridSkeleton viewMode={viewMode} />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className={cn("w-full", className)}>
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Failed to load products
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        {showViewToggle && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Products</h2>
            <ProductViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        )}
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header with View Toggle */}
      {showViewToggle && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Products ({products.length})
          </h2>
          <ProductViewToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      )}

      {/* Products Grid/List */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
            : "space-y-4",
        )}
      >
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            viewMode={viewMode}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
    </div>
  );
};

// View Toggle Component
interface ProductViewToggleProps {
  viewMode: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

const ProductViewToggle: React.FC<ProductViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  if (!onViewModeChange) return null;

  return (
    <div className="flex items-center rounded-lg border p-1">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        className="h-8 w-8 p-0"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("list")}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Product Item Component
interface ProductItemProps {
  product: Product;
  viewMode: "grid" | "list";
  onClick?: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  viewMode,
  onClick,
}) => {
  const isOutOfStock = product.totalStock === 0;

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          isOutOfStock && "opacity-75",
          onClick && "cursor-pointer",
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <div className="bg-muted relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              {product.picture1 ? (
                <Image
                  src={product.picture1}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground text-xs">
                    No image
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-lg font-medium">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {product.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-sm">
                      Stock: {product.totalStock}
                    </span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-primary text-xl font-bold">
                    {formatCurrency(product.price)}
                  </p>
                  {isOutOfStock && (
                    <Badge variant="destructive" className="mt-1">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group transition-all duration-200 hover:shadow-md",
        isOutOfStock && "opacity-75",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="bg-muted relative aspect-square w-full overflow-hidden rounded-t-lg">
          {product.picture1 ? (
            <Image
              src={product.picture1}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            {product.category && (
              <Badge variant="secondary" className="mb-2 text-xs">
                {product.category.name}
              </Badge>
            )}
            <h3 className="mb-1 line-clamp-2 font-medium">{product.name}</h3>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-primary text-lg font-bold">
              {formatCurrency(product.price)}
            </p>
            <span className="text-muted-foreground text-xs">
              Stock: {product.totalStock}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const ProductGridSkeleton: React.FC<{ viewMode: "grid" | "list" }> = ({
  viewMode,
}) => {
  const skeletonItems = Array.from({ length: 8 }, (_, i) => i);

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {skeletonItems.map((item) => (
          <Card key={item}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {skeletonItems.map((item) => (
        <Card key={item}>
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full rounded-t-lg" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
