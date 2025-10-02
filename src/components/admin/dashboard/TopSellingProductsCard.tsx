import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Package } from "lucide-react";
import Image from "next/image";
import { TopSellingProduct } from "@/types/admin/dashboard";

interface TopSellingProductsCardProps {
  products: TopSellingProduct[];
  isLoading?: boolean;
}

export default function TopSellingProductsCard({
  products,
  isLoading,
}: TopSellingProductsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Selling Products
        </CardTitle>
        <CardDescription>Best performers this month</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <Package className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">
              No sales data available for this period
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div
                key={product.productId}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                {/* Rank Badge */}
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                        ? "bg-gray-100 text-gray-700"
                        : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Product Image */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                  {product.picture ? (
                    <Image
                      src={product.picture}
                      alt={product.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-gray-900">
                    {product.productName}
                  </h4>
                  <p className="truncate text-xs text-gray-500">
                    {product.categoryName}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold whitespace-nowrap text-gray-900">
                    {product.quantitySold} sold
                  </p>
                  <p className="text-xs whitespace-nowrap text-gray-500">
                    {formatCurrency(product.totalRevenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
