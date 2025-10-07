"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Package,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import ReportFilters from "./ReportFilters";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { MonthlyStockReport } from "@/types/reports";

interface StockReportsProps {
  storeId?: string;
  month: number;
  year: number;
  onStoreChange: (storeId: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function StockReports({
  storeId,
  month,
  year,
  onStoreChange,
  onMonthChange,
  onYearChange,
}: StockReportsProps) {
  const { admin } = useAdminAuthStore();
  const token = admin?.accessToken;

  const { data, isLoading, error } = useQuery({
    queryKey: ["stock-report-monthly", storeId, month, year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (storeId) params.append("storeId", storeId);
      params.append("month", month.toString());
      params.append("year", year.toString());

      const response = await axiosInstance.get<{ data: MonthlyStockReport }>(
        `/reports/stock/monthly?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.data;
    },
    enabled: !!token && !!month && !!year,
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ReportFilters
        storeId={storeId}
        month={month}
        year={year}
        onStoreChange={onStoreChange}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load stock data. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.lowStockProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Out of Stock
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {data.outOfStockProducts || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stock Value
                </CardTitle>
                <Package className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {(data.stockValue || 0).toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements Summary</CardTitle>
              <p className="text-muted-foreground text-sm">
                Track all inventory changes during this period
              </p>
            </CardHeader>
            <CardContent>
              {data.stockMovements && data.stockMovements.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {data.stockMovements.map(
                    (movement: {
                      type:
                        | "IN"
                        | "OUT"
                        | "ADJUSTMENT"
                        | "TRANSFER"
                        | "INITIAL";
                      quantity: number;
                      count: number;
                    }) => {
                      const movementInfoMap = {
                        IN: {
                          label: "Stock Received",
                          description: "New inventory added",
                          color: "text-green-600",
                          bgColor: "bg-green-50",
                          icon: "📦",
                        },
                        OUT: {
                          label: "Stock Sold",
                          description: "Products sold to customers",
                          color: "text-red-600",
                          bgColor: "bg-red-50",
                          icon: "📤",
                        },
                        ADJUSTMENT: {
                          label: "Stock Adjustments",
                          description: "Manual corrections",
                          color: "text-blue-600",
                          bgColor: "bg-blue-50",
                          icon: "⚖️",
                        },
                        TRANSFER: {
                          label: "Stock Transfers",
                          description: "Moved between stores",
                          color: "text-purple-600",
                          bgColor: "bg-purple-50",
                          icon: "🔄",
                        },
                        INITIAL: {
                          label: "Initial Stock",
                          description: "First inventory setup",
                          color: "text-orange-600",
                          bgColor: "bg-orange-50",
                          icon: "🏁",
                        },
                      };

                      const movementInfo = movementInfoMap[movement.type] || {
                        label: "Unknown",
                        description: "Unknown movement type",
                        color: "text-gray-600",
                        bgColor: "bg-gray-50",
                        icon: "❓",
                      };

                      return (
                        <div
                          key={movement.type}
                          className={`flex flex-col space-y-3 rounded-lg border p-4 ${movementInfo.bgColor}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {movementInfo.icon}
                                </span>
                                <span
                                  className={`text-sm font-semibold ${movementInfo.color}`}
                                >
                                  {movementInfo.label}
                                </span>
                              </div>
                              <p className="text-muted-foreground mt-1 text-xs">
                                {movementInfo.description}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div
                              className={`text-2xl font-bold ${movementInfo.color}`}
                            >
                              {movement.type === "OUT" ? "-" : "+"}
                              {(movement.quantity || 0).toLocaleString(
                                "id-ID",
                              )}{" "}
                              units
                            </div>
                            <p className="text-muted-foreground text-xs">
                              {(movement.count || 0).toLocaleString("id-ID")}{" "}
                              {movement.count === 1
                                ? "transaction"
                                : "transactions"}
                            </p>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">
                  No stock movement data available for this period
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Restocked Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Restocked Products</CardTitle>
              <p className="text-muted-foreground text-sm">
                Products with the highest positive stock movements in{" "}
                <span className="font-semibold">
                  {new Date(year, month - 1).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              {data.topRestockedProducts &&
              data.topRestockedProducts.length > 0 ? (
                <div className="space-y-4">
                  {data.topRestockedProducts.map(
                    (
                      product: {
                        productId: string;
                        productName: string;
                        quantity: number;
                      },
                      index: number,
                    ) => (
                      <div
                        key={product.productId}
                        className="flex items-center rounded-lg border p-3 hover:bg-gray-50"
                      >
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{product.productName}</p>
                          <p className="text-muted-foreground text-sm">
                            Total quantity received
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            +{(product.quantity || 0).toLocaleString("id-ID")}
                          </p>
                          <p className="text-muted-foreground text-xs">units</p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground space-y-3 py-8 text-center">
                  <Package className="mx-auto h-12 w-12 opacity-20" />
                  <p className="font-medium">No Positive Stock Movements</p>
                  <p className="text-sm">
                    No products had positive stock movements in{" "}
                    <span className="font-semibold">
                      {new Date(year, month - 1).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    .
                  </p>
                  <p className="text-xs">
                    This includes Stock Received, positive Adjustments,
                    Transfers received, and Initial stock setup.
                  </p>
                  <p className="text-xs italic">
                    💡 Tip: Check if you&apos;ve selected the correct month/year
                    filter above.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center">
            No stock data available for the selected period.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
