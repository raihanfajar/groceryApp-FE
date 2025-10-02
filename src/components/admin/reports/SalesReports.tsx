"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMonthlySalesReport } from "@/hooks/admin/reports/useMonthlySalesReport";
import { useCategorySalesReport } from "@/hooks/admin/reports/useCategorySalesReport";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import ReportFilters from "./ReportFilters";
import SalesLineChart from "./charts/SalesLineChart";
import CategoryBarChart from "./charts/CategoryBarChart";
import ProductPieChart from "./charts/ProductPieChart";

interface SalesReportsProps {
  storeId?: string;
  month: number;
  year: number;
  onStoreChange: (storeId: string) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function SalesReports({
  storeId,
  month,
  year,
  onStoreChange,
  onMonthChange,
  onYearChange,
}: SalesReportsProps) {
  const {
    data: monthlySales,
    isLoading: isLoadingMonthlySales,
    error: monthlySalesError,
  } = useMonthlySalesReport({ storeId, month, year });

  const {
    data: categorySales,
    isLoading: isLoadingCategorySales,
    error: categorySalesError,
  } = useCategorySalesReport({ storeId, month, year });

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

      {/* Sub-tabs for different sales views */}
      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        {/* Monthly Sales Tab */}
        <TabsContent value="monthly" className="space-y-4">
          {monthlySalesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load monthly sales data. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isLoadingMonthlySales ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
              <Skeleton className="h-64" />
            </div>
          ) : monthlySales ? (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp{" "}
                      {(monthlySales.totalRevenue || 0).toLocaleString("id-ID")}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingCart className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(monthlySales.totalOrders || 0).toLocaleString("id-ID")}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Order Value
                    </CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      Rp{" "}
                      {(monthlySales.averageOrderValue || 0).toLocaleString(
                        "id-ID",
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Selling Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {monthlySales.topSellingProducts &&
                  monthlySales.topSellingProducts.length > 0 ? (
                    <div className="space-y-4">
                      {monthlySales.topSellingProducts.map((product, index) => (
                        <div
                          key={product.productId}
                          className="flex items-center"
                        >
                          <div className="bg-primary/10 text-primary mr-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-muted-foreground text-sm">
                              {product.quantity || 0} units sold
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              Rp{" "}
                              {(product.revenue || 0).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4 text-center">
                      No product sales data available
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Daily Sales Chart */}
              {monthlySales.dailySales &&
                monthlySales.dailySales.length > 0 && (
                  <SalesLineChart
                    data={monthlySales.dailySales.map((day) => ({
                      name: new Date(day.date).getDate().toString(),
                      value: day.revenue,
                      orders: day.orders,
                    }))}
                    title="Daily Sales Trend"
                    dataKey="value"
                    xAxisKey="name"
                    yAxisLabel="Revenue (Rp)"
                    color="#2563eb"
                    height={300}
                  />
                )}

              {/* Top Products Pie Chart */}
              {monthlySales.topSellingProducts &&
                monthlySales.topSellingProducts.length > 0 && (
                  <ProductPieChart
                    data={monthlySales.topSellingProducts
                      .slice(0, 8)
                      .map((product) => ({
                        name: product.productName,
                        value: product.revenue,
                      }))}
                    title="Revenue Distribution by Top Products"
                    dataKey="value"
                    nameKey="name"
                    height={350}
                  />
                )}
            </>
          ) : null}
        </TabsContent>

        {/* Category Sales Tab */}
        <TabsContent value="categories" className="space-y-4">
          {categorySalesError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load category sales data. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isLoadingCategorySales ? (
            <div className="space-y-4">
              <Skeleton className="h-64" />
              <div className="grid gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
              </div>
            </div>
          ) : categorySales && categorySales.length > 0 ? (
            <div className="space-y-6">
              {/* Category Revenue Bar Chart */}
              <CategoryBarChart
                data={categorySales.map((category) => ({
                  name: category.categoryName,
                  value: category.totalRevenue,
                }))}
                title="Revenue by Category"
                dataKey="value"
                xAxisKey="name"
                yAxisLabel="Revenue (Rp)"
                height={300}
              />

              {/* Category Details Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {categorySales.map((category) => (
                  <Card key={category.categoryId}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {category.categoryName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Revenue
                          </p>
                          <p className="text-xl font-bold">
                            Rp{" "}
                            {(category.totalRevenue || 0).toLocaleString(
                              "id-ID",
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm">
                            Units Sold
                          </p>
                          <p className="text-xl font-bold">
                            {(category.totalQuantity || 0).toLocaleString(
                              "id-ID",
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Top Products in Category */}
                      <div>
                        <p className="mb-2 text-sm font-medium">Top Products</p>
                        <div className="space-y-2">
                          {category.products && category.products.length > 0 ? (
                            category.products.slice(0, 3).map((product) => (
                              <div
                                key={product.productId}
                                className="flex justify-between text-sm"
                              >
                                <span className="text-muted-foreground">
                                  {product.productName}
                                </span>
                                <span className="font-medium">
                                  {product.quantity || 0} units
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground text-sm">
                              No products
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center">
                No sales data available for the selected period.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
