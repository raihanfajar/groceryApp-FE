import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, ExternalLink } from "lucide-react";
import Link from "next/link";

interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  price: number;
  storeId: string;
  storeName: string;
}

interface LowStockAlertsSectionProps {
  lowStockProducts: LowStockProduct[];
  outOfStockProducts: LowStockProduct[];
  isLoading?: boolean;
}

const LowStockAlertsSection: React.FC<LowStockAlertsSectionProps> = ({
  lowStockProducts,
  outOfStockProducts,
  isLoading = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return { label: "Out of Stock", variant: "destructive" as const };
    } else if (currentStock <= minStock) {
      return { label: "Low Stock", variant: "secondary" as const };
    }
    return { label: "In Stock", variant: "default" as const };
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ProductCard = ({ product }: { product: LowStockProduct }) => {
    const status = getStockStatus(product.currentStock, product.minStock);

    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h4 className="text-sm font-medium">{product.name}</h4>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="mb-1 text-xs text-gray-600">{product.category}</p>
          <p className="text-xs text-gray-500">{product.storeName}</p>
          <div className="mt-2 flex items-center gap-4">
            <span className="text-xs text-gray-600">
              Stock: <span className="font-medium">{product.currentStock}</span>
            </span>
            <span className="text-xs text-gray-600">
              Min: <span className="font-medium">{product.minStock}</span>
            </span>
            <span className="text-xs text-gray-600">
              Price:{" "}
              <span className="font-medium">
                {formatCurrency(product.price)}
              </span>
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild className="ml-4">
          <Link
            href={`/admin/inventory/stock?search=${encodeURIComponent(product.name)}`}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Update
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Low Stock Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Low Stock Alerts
            <Badge variant="secondary">{lowStockProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p>No low stock items</p>
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          {lowStockProducts.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/inventory/stock?filter=low-stock">
                  View All Low Stock Items
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Out of Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-red-500" />
            Out of Stock
            <Badge variant="destructive">{outOfStockProducts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {outOfStockProducts.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <Package className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p>No out of stock items</p>
              </div>
            ) : (
              outOfStockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          {outOfStockProducts.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/admin/inventory/stock?filter=out-of-stock">
                  View All Out of Stock Items
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LowStockAlertsSection;
