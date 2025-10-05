import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { Package, Plus, Minus, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface StockProductCardProps {
  product: AdminProduct;
  selectedStoreId?: string;
  onUpdateStock: (
    productId: string,
    storeId: string,
    newStock: number,
    reason: string,
  ) => Promise<void>;
}

const StockProductCard: React.FC<StockProductCardProps> = ({
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
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square">
        {product.picture1 ? (
          <Image
            src={product.picture1}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="absolute top-1 right-1 flex flex-col gap-1">
          <Badge
            variant={product.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
          {isLowStock && (
            <Badge variant="destructive" className="flex items-center text-xs">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Low
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-3">
        <div className="space-y-2">
          <div>
            <h3 className="truncate text-sm font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="truncate text-xs text-gray-600">
              {product.category.name}
            </p>
            <p className="text-xs font-medium text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock Information */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Stock:</span>
              <div className="text-right">
                <span
                  className={`text-base font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
                >
                  {currentStock}
                </span>
                {pendingStock !== null && pendingStock !== currentStock && (
                  <div className="text-xs font-medium text-blue-600">
                    → {pendingStock}
                  </div>
                )}
              </div>
            </div>
            {minStock > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Min:</span>
                <span className="text-gray-900">{minStock}</span>
              </div>
            )}
          </div>

          {/* Stock Actions */}
          {selectedStoreId && selectedStoreId !== "all" ? (
            <div className="space-y-1.5">
              {!showStockInput ? (
                <>
                  <div className="grid grid-cols-3 gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleQuickSubtract}
                      disabled={isUpdating}
                      className="h-8 px-2"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowStockInput(true)}
                      className="h-8 px-1 text-xs"
                    >
                      Set
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleQuickAdd}
                      disabled={isUpdating}
                      className="h-8 px-2"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Apply/Cancel buttons when there are pending changes */}
                  {pendingStock !== null && pendingStock !== currentStock && (
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelChanges}
                        disabled={isUpdating}
                        className="h-8 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApplyChanges}
                        disabled={isUpdating}
                        className="h-8 text-xs"
                      >
                        {isUpdating ? "..." : "Apply"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-1.5">
                  <Input
                    type="number"
                    placeholder="Stock amount"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                    min="0"
                    className="h-8 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowStockInput(false);
                        setStockValue("");
                      }}
                      className="h-8 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSetStock}
                      disabled={!stockValue || isNaN(parseInt(stockValue))}
                      className="h-8 text-xs"
                    >
                      Set
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-2 text-center">
              <p className="text-xs font-medium text-yellow-700">
                Select a store
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockProductCard;
