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

  const handleStockUpdate = async (
    operation: "add" | "subtract" | "set",
    amount?: number,
  ) => {
    if (!selectedStoreId) return;

    setIsUpdating(true);
    try {
      let newStock: number;
      let reason: string;

      if (operation === "set" && amount !== undefined) {
        newStock = amount;
        reason = `Stock set to ${amount}`;
      } else if (operation === "add" && amount !== undefined) {
        newStock = currentStock + amount;
        reason = `Stock increased by ${amount}`;
      } else if (operation === "subtract" && amount !== undefined) {
        newStock = Math.max(0, currentStock - amount);
        reason = `Stock decreased by ${amount}`;
      } else {
        return;
      }

      await onUpdateStock(product.id, selectedStoreId, newStock, reason);
      setShowStockInput(false);
      setStockValue("");
    } catch (error) {
      console.error("Failed to update stock:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAdd = () => handleStockUpdate("add", 1);
  const handleQuickSubtract = () => handleStockUpdate("subtract", 1);

  const handleSetStock = () => {
    const value = parseInt(stockValue);
    if (!isNaN(value) && value >= 0) {
      handleStockUpdate("set", value);
    }
  };

  return (
    <Card className="overflow-hidden">
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
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 space-y-1">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
          {isLowStock && (
            <Badge variant="destructive" className="flex items-center">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Low Stock
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="truncate font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              Category: {product.category.name}
            </p>
            <p className="text-sm font-medium text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Stock Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Current Stock:
              </span>
              <span
                className={`text-lg font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
              >
                {currentStock}
              </span>
            </div>
            {minStock > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Min Stock:</span>
                <span className="text-gray-900">{minStock}</span>
              </div>
            )}
          </div>

          {/* Stock Actions */}
          {selectedStoreId && (
            <div className="space-y-2">
              {!showStockInput ? (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickSubtract}
                    disabled={isUpdating || currentStock === 0}
                    className="flex-1"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowStockInput(true)}
                    className="flex-1"
                  >
                    Set Stock
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickAdd}
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Enter new stock amount"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                    min="0"
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowStockInput(false);
                        setStockValue("");
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSetStock}
                      disabled={isUpdating || !stockValue}
                      className="flex-1"
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockProductCard;
