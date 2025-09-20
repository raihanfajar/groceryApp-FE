import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { Store } from "lucide-react";

interface ProductStockCardProps {
  product: AdminProduct;
}

export default function ProductStockCard({ product }: ProductStockCardProps) {
  if (!product.storeStock || product.storeStock.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Store className="mr-2 h-5 w-5" />
          Store Stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.storeStock.map((stock) => (
            <div
              key={stock.storeId}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div>
                <h4 className="font-medium">{stock.store.name}</h4>
                <p className="text-sm text-gray-600">
                  Min Stock: {stock.minStock}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{stock.stock} units</p>
                <Badge
                  variant={
                    stock.stock > stock.minStock
                      ? "default"
                      : stock.stock > 0
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {stock.stock > stock.minStock
                    ? "In Stock"
                    : stock.stock > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                </Badge>
              </div>
            </div>
          ))}

          {product.totalStock !== undefined && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Stock:</span>
                <span className="text-lg font-bold">
                  {product.totalStock} units
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
