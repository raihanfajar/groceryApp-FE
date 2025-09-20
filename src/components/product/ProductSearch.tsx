import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useProductSearch } from "@/hooks/product/useProducts";
import { Product } from "@/types/product/productTypes";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";

interface ProductSearchProps {
  onSelectProduct?: (product: Product) => void;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showResults?: boolean;
  autoFocus?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({
  onSelectProduct,
  onSearchChange,
  placeholder = "Search products...",
  className,
  showResults = true,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  // Fetch search results
  const {
    data: searchResults,
    isLoading,
    error,
  } = useProductSearch(
    debouncedQuery,
    debouncedQuery.length >= 2 && isOpen && showResults,
  );

  // Handle search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setQuery(value);
      setIsOpen(true);
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  // Handle product selection
  const handleProductSelect = useCallback(
    (product: Product) => {
      onSelectProduct?.(product);
      setIsOpen(false);
      setQuery("");
    },
    [onSelectProduct],
  );

  // Clear search
  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setIsOpen(false);
    onSearchChange?.("");
  }, [onSearchChange]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const products = searchResults?.data?.products || [];
  const hasResults = products.length > 0;

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          autoFocus={autoFocus}
          className="pr-10 pl-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="hover:bg-muted absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && showResults && debouncedQuery.length >= 2 && (
        <Card className="absolute top-full z-50 mt-1 w-full shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  Searching...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="p-4 text-center">
                <p className="text-destructive text-sm">
                  Failed to search products
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && !hasResults && (
              <div className="p-4 text-center">
                <p className="text-muted-foreground text-sm">
                  No products found for &quot;{debouncedQuery}&quot;
                </p>
              </div>
            )}

            {/* Results List */}
            {!isLoading && hasResults && (
              <div className="max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <SearchResultItem
                    key={product.id}
                    product={product}
                    onClick={() => handleProductSelect(product)}
                  />
                ))}

                {/* View All Results Link */}
                {products.length === 10 && (
                  <div className="border-t p-3">
                    <Link
                      href={`/products?search=${encodeURIComponent(debouncedQuery)}`}
                      className="text-primary block text-center text-sm hover:underline"
                      onClick={() => setIsOpen(false)}
                    >
                      View all results for &quot;{debouncedQuery}&quot;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Search Result Item Component
interface SearchResultItemProps {
  product: Product;
  onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  product,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted flex w-full items-center gap-3 border-b p-3 text-left transition-colors last:border-b-0"
    >
      {/* Product Image */}
      <div className="bg-muted relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
        {product.picture1 ? (
          <Image
            src={product.picture1}
            alt={product.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium">{product.name}</h4>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-primary text-sm font-medium">
            {formatCurrency(product.price)}
          </span>
          {product.category && (
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
};
