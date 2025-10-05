import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { Package, Plus, Minus, AlertTriangle, Check, X } from "lucide-react";
import Image from "next/image";

interface StockProductListItemProps {
  product: AdminProduct;
  selectedStoreId?: string;
  onUpdateStock: (
    productId: string,
    storeId: string,
    newStock: number,
    reason: string,
  ) => Promise<void>;
}

const StockProductListItem: React.FC<StockProductListItemProps> = ({
  product,
  selectedStoreId,
  onUpdateStock,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [stockValue, setStockValue] = useState("");
  const [showStockInput, setShowStockInput] = useState(false);
  const [pendingStock, setPendingStock] = useState<number | null>(null);
  const [pendingReason, setPendingReason] = useState("");

  // Get current stock for the selected store
  const getCurrentStock = () => {
    if (!selectedStoreId) return product.totalStock || 0;
    const storeStock = product.storeStock?.find(
      (s) => s.storeId === selectedStoreId,
    );
    return storeStock?.stock || 0;
  };

  const getMinStock = () => {
    if (!selectedStoreId) return 0;
    const storeStock = product.storeStock?.find(
      (s) => s.storeId === selectedStoreId,
    );
    return storeStock?.minStock || 0;
  };

  const currentStock = getCurrentStock();
  const minStock = getMinStock();
  const isLowStock = currentStock <= minStock;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleQuickAdd = () => {
    const newStock = (pendingStock ?? currentStock) + 1;
    setPendingStock(newStock);
    setPendingReason(`Stock increased by 1`);
  };

  const handleQuickSubtract = () => {
    const newStock = Math.max(0, (pendingStock ?? currentStock) - 1);
    setPendingStock(newStock);
    setPendingReason(`Stock decreased by 1`);
  };

  const handleSetStock = () => {
    const value = parseInt(stockValue);
    if (!isNaN(value) && value >= 0) {
      setPendingStock(value);
      setPendingReason(`Stock set to ${value}`);
      setShowStockInput(false);
      setStockValue("");
    }
  };

  const handleApplyChanges = async () => {
    if (!selectedStoreId || selectedStoreId === "all" || pendingStock === null)
      return;

    setIsUpdating(true);
    try {
      await onUpdateStock(
        product.id,
        selectedStoreId,
        pendingStock,
        pendingReason,
      );
      setPendingStock(null);
      setPendingReason("");
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelChanges = () => {
    setPendingStock(null);
    setPendingReason("");
    setShowStockInput(false);
    setStockValue("");
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
      <div className="flex min-w-0 flex-1 items-center space-x-4">
        {/* Product Image */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {product.picture1 ? (
            <Image
              src={product.picture1}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="truncate font-medium text-gray-900">
              {product.name}
            </h3>
            <Badge
              variant={product.isActive ? "default" : "secondary"}
              className="flex-shrink-0"
            >
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
            {isLowStock && (
              <Badge
                variant="destructive"
                className="flex flex-shrink-0 items-center"
              >
                <AlertTriangle className="mr-1 h-3 w-3" />
                Low
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
            <span>{product.category.name}</span>
            <span className="font-medium text-green-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Stock Info */}
        <div className="flex flex-shrink-0 items-center space-x-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">Current Stock</p>
            <p
              className={`text-lg font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
            >
              {currentStock}
            </p>
            {pendingStock !== null && pendingStock !== currentStock && (
              <p className="text-xs font-medium text-blue-600">
                → {pendingStock}
              </p>
            )}
          </div>
          {minStock > 0 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Min Stock</p>
              <p className="text-sm font-medium text-gray-900">{minStock}</p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Actions */}
      <div className="ml-4 flex flex-shrink-0 items-center space-x-2">
        {selectedStoreId && selectedStoreId !== "all" ? (
          <>
            {!showStockInput ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickSubtract}
                  disabled={isUpdating}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStockInput(true)}
                  disabled={isUpdating}
                >
                  Set
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuickAdd}
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {pendingStock !== null && pendingStock !== currentStock && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelChanges}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyChanges}
                      disabled={isUpdating}
                    >
                      <Check className="h-4 w-4" />
                      {isUpdating ? "..." : "Apply"}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Input
                  type="number"
                  placeholder="Stock"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  min="0"
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowStockInput(false);
                    setStockValue("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSetStock}
                  disabled={!stockValue || isNaN(parseInt(stockValue))}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
            Select a store
          </div>
        )}
      </div>
    </div>
  );
};

export default StockProductListItem;
