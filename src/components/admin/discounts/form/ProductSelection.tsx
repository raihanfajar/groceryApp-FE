import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductSelectionProps {
  products?: Product[];
  selectedProductIds: string[];
  isLoading: boolean;
  hasError: boolean;
  hasAuthToken: boolean;
  onProductToggle: (productId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
}

export default function ProductSelection({
  products,
  selectedProductIds,
  isLoading,
  hasError,
  hasAuthToken,
  onProductToggle,
  onSelectAll,
}: ProductSelectionProps) {
  return (
    <div className="space-y-2">
      <Label>Select Products *</Label>
      {!hasAuthToken && (
        <p className="rounded bg-amber-50 p-2 text-sm text-amber-600">
          ⚠️ Using public product list. Please log in as admin for full access.
        </p>
      )}
      <div className="max-h-60 overflow-y-auto rounded-md border p-4">
        {products && products.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedProductIds.length === products.length}
                onCheckedChange={onSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium">
                Select All Products
              </Label>
            </div>
            <div className="border-t pt-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center space-x-2 py-1"
                >
                  <Checkbox
                    id={product.id}
                    checked={selectedProductIds.includes(product.id)}
                    onCheckedChange={(checked) =>
                      onProductToggle(product.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={product.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex-1 truncate">{product.name}</span>
                      <span className="text-sm font-medium whitespace-nowrap text-blue-600">
                        Rp {product.price?.toLocaleString()}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ) : isLoading ? (
          <p className="text-sm text-gray-500">Loading products...</p>
        ) : hasError ? (
          <p className="text-sm text-red-600">
            Error loading products. Please try again.
          </p>
        ) : (
          <p className="text-sm text-gray-500">No products available.</p>
        )}
      </div>
      {selectedProductIds.length === 0 && (
        <p className="text-sm text-red-600">
          At least one product must be selected
        </p>
      )}
    </div>
  );
}
