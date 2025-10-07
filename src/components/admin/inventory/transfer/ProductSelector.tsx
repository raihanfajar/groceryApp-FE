import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { AdminProduct } from "@/types/admin/product";
import Image from "next/image";

interface ProductSelectorProps {
  products: AdminProduct[];
  fromStoreId: string;
  searchQuery: string;
  productId: string;
  showDropdown: boolean;
  loadingProducts: boolean;
  onSearchChange: (query: string) => void;
  onProductSelect: (productId: string, productName: string) => void;
  onDropdownToggle: (show: boolean) => void;
}

export default function ProductSelector({
  products,
  fromStoreId,
  searchQuery,
  productId,
  showDropdown,
  loadingProducts,
  onSearchChange,
  onProductSelect,
  onDropdownToggle,
}: ProductSelectorProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onDropdownToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onDropdownToggle]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="product">
        Product <span className="text-red-500">*</span>
      </Label>
      <div className="relative" ref={dropdownRef}>
        <Input
          id="product"
          type="text"
          placeholder={
            !fromStoreId
              ? "Select source store first"
              : loadingProducts
                ? "Loading products..."
                : "Search and select product..."
          }
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onDropdownToggle(true);
          }}
          onFocus={() => onDropdownToggle(true)}
          disabled={!fromStoreId || loadingProducts}
          className="w-full"
        />
        {showDropdown && searchQuery && fromStoreId && (
          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const storeStock = product.storeStock?.find(
                  (s) => s.storeId === fromStoreId,
                );
                const stock = storeStock?.stock || 0;
                const isOutOfStock = stock <= 0;

                return (
                  <button
                    key={product.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      if (!isOutOfStock) {
                        onProductSelect(product.id, product.name);
                      }
                    }}
                    className={`w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 ${
                      isOutOfStock
                        ? "cursor-not-allowed bg-gray-50 opacity-60"
                        : "hover:bg-gray-50"
                    } ${productId === product.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {product.picture1 ? (
                          <Image
                            src={product.picture1}
                            alt={product.name}
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                            <Package className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          stock <= 0
                            ? "text-red-600"
                            : stock < (storeStock?.minStock || 0)
                              ? "text-orange-600"
                              : "text-green-600"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : `Stock: ${stock}`}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  No Product Found
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Try adjusting your search query
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
