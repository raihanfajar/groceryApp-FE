import React from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product/productTypes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Warehouse } from "lucide-react";
import { useAddCartProduct } from "@/hooks/cart/getUserCart";

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
            ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
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
  const addCart = useAddCartProduct();

  // Calculate discount if available
  const discount =
    product.discount?.valueType === "PERCENTAGE"
      ? product.discount.value / 100
      : undefined;
  const displayedPrice = discount
    ? Math.round(product.price * (1 - discount))
    : product.price;

  // Get promotion badge info
  const getPromotionBadge = () => {
    if (!product.discount) return null;

    const { type, valueType, value } = product.discount;

    if (type === "BOGO") {
      return { text: "BOGO", color: "bg-orange-600" };
    } else if (type === "MINIMUM_PURCHASE") {
      return { text: "Min Purchase", color: "bg-blue-600" };
    } else if (valueType === "PERCENTAGE") {
      return { text: `-${Math.round(value)}%`, color: "bg-red-600" };
    } else if (valueType === "NOMINAL") {
      return { text: `-Rp${(value / 1000).toFixed(0)}K`, color: "bg-red-600" };
    }
    return { text: "Promo", color: "bg-purple-600" };
  };

  const promotionBadge = getPromotionBadge();

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          isOutOfStock && "opacity-75",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Product Image */}
            <div
              className="bg-muted relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
              onClick={onClick}
            >
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
              {promotionBadge && (
                <Badge
                  className={`absolute top-1 right-1 ${promotionBadge.color} px-1 py-0 text-[10px] text-white`}
                >
                  {promotionBadge.text}
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3
                    className="line-clamp-1 cursor-pointer text-lg font-medium hover:text-green-600"
                    onClick={onClick}
                  >
                    {product.name}
                  </h3>
                  {product.description.includes("<") &&
                  product.description.includes(">") ? (
                    <div
                      className="text-muted-foreground mt-1 line-clamp-2 text-sm [&_em]:italic [&_ol]:list-decimal [&_strong]:font-bold [&_ul]:list-disc"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                      </Badge>
                    )}
                    {promotionBadge && (
                      <Badge
                        className={`${promotionBadge.color} text-[10px] text-white`}
                      >
                        {promotionBadge.text}
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-sm">
                      Stock: {product.totalStock}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xl font-bold text-red-600">
                      Rp {displayedPrice.toLocaleString("id-ID")}
                    </p>
                    {discount && (
                      <span className="text-xs text-gray-500 line-through">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={() =>
                      addCart.mutate({ productId: String(product.id) })
                    }
                    disabled={isOutOfStock}
                    variant={isOutOfStock ? "secondary" : "default"}
                    size="sm"
                    className={
                      isOutOfStock
                        ? "cursor-not-allowed"
                        : "cursor-pointer bg-green-700 hover:bg-green-600"
                    }
                  >
                    {isOutOfStock ? "Unavailable" : "Buy"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view - matching homepage ProductCard design
  return (
    <Card
      className={cn(
        "group relative mx-auto flex w-full max-w-[180px] flex-col justify-between gap-3 rounded-xl p-2 shadow-md transition hover:shadow-lg",
        isOutOfStock && "opacity-75",
      )}
    >
      {/* image */}
      <div
        onClick={onClick}
        className="relative flex h-40 w-full cursor-pointer items-center justify-center rounded-md bg-white"
      >
        <Image
          src={product.picture1 || "/img-placeholder.svg"}
          alt={product.name}
          width={120}
          height={120}
          className="object-contain"
        />
        {promotionBadge && (
          <Badge
            className={`absolute top-2 right-2 ${promotionBadge.color} text-[10px] text-white`}
          >
            {promotionBadge.text}
          </Badge>
        )}
      </div>

      {/* meta */}
      <CardContent className="flex h-[40%] flex-col gap-1 px-2 pb-0">
        <Badge variant="secondary" className="w-fit bg-green-100 text-[10px]">
          {product.category?.name || "Uncategorized"}
        </Badge>
        <p className="line-clamp-2 text-xs md:text-sm">{product.name}</p>
        <div className="mt-auto">
          <p className="font-bold text-red-600">
            Rp {displayedPrice.toLocaleString("id-ID")}
          </p>
          {discount && (
            <p className="text-xs text-gray-500 line-through">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          )}
        </div>
        <div className="flex h-5 items-center gap-1 text-[10px] text-gray-600">
          <Warehouse size={14} className="text-orange-500" />
          <span>Stock</span>
          <span className="ml-auto">{product.totalStock}</span>
        </div>
      </CardContent>

      {/* button */}
      <CardFooter className="p-2">
        <Button
          onClick={() => addCart.mutate({ productId: String(product.id) })}
          disabled={isOutOfStock}
          variant={isOutOfStock ? "secondary" : "default"}
          className={`w-full ${
            isOutOfStock
              ? "cursor-not-allowed"
              : "cursor-pointer bg-green-700 hover:bg-green-600"
          }`}
        >
          {isOutOfStock ? "Out of stock" : "Buy"}
        </Button>
      </CardFooter>
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {skeletonItems.map((item) => (
        <Card key={item} className="rounded-xl p-2">
          <Skeleton className="h-40 w-full rounded-md" />
          <div className="mt-3 space-y-2 px-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-9 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
};
