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
  ArrowUpDown,
} from "lucide-react";
import ReportFilters from "./ReportFilters";
import CategoryBarChart from "./charts/CategoryBarChart";
import ProductPieChart from "./charts/ProductPieChart";
import TopSellingProductsCard from "../dashboard/TopSellingProductsCard";
import SalesGraphCard from "../dashboard/SalesGraphCard";
import { useState } from "react";

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
  const [sortColumn, setSortColumn] = useState<
    | "categoryName"
    | "totalRevenue"
    | "totalQuantity"
    | "orderCount"
    | "avgOrderValue"
  >("totalRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedCategories = categorySales
    ? [...categorySales].sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortColumn) {
          case "categoryName":
            aValue = a.categoryName;
            bValue = b.categoryName;
            break;
          case "totalRevenue":
            aValue = a.totalRevenue;
            bValue = b.totalRevenue;
            break;
          case "totalQuantity":
            aValue = a.totalQuantity;
            bValue = b.totalQuantity;
            break;
          case "orderCount":
            aValue = a.orderCount;
            bValue = b.orderCount;
            break;
          case "avgOrderValue":
            aValue = a.orderCount > 0 ? a.totalRevenue / a.orderCount : 0;
            bValue = b.orderCount > 0 ? b.totalRevenue / b.orderCount : 0;
            break;
          default:
            aValue = 0;
            bValue = 0;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      })
    : [];

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
                      {(monthlySales.summary.totalSales || 0).toLocaleString(
                        "id-ID",
                      )}
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
                      {(
                        monthlySales.summary.totalTransactions || 0
                      ).toLocaleString("id-ID")}
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
                      {(
                        monthlySales.summary.averageOrderValue || 0
                      ).toLocaleString("id-ID")}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Daily Sales Chart */}
              {monthlySales.dailySales &&
                monthlySales.dailySales.length > 0 && (
                  <SalesGraphCard
                    labels={monthlySales.dailySales.map((day) =>
                      new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      }),
                    )}
                    data={monthlySales.dailySales.map((day) => day.totalSales)}
                    isLoading={isLoadingMonthlySales}
                  />
                )}

              {/* Top Selling Products and Revenue Distribution - Side by Side */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* Top Selling Products */}
                <TopSellingProductsCard
                  products={
                    monthlySales.topProducts?.map((product) => ({
                      productId: product.productId,
                      productName: product.productName,
                      categoryName: product.categoryName,
                      picture: product.picture,
                      quantitySold: product.quantitySold,
                      totalRevenue: product.totalRevenue,
                    })) || []
                  }
                  isLoading={isLoadingMonthlySales}
                />

                {/* Revenue Distribution Pie Chart */}
                {monthlySales.topProducts &&
                monthlySales.topProducts.length > 0 ? (
                  <ProductPieChart
                    data={monthlySales.topProducts
                      .slice(0, 8)
                      .map((product) => ({
                        name: product.productName,
                        value: product.totalRevenue,
                      }))}
                    title="Revenue Distribution by Top Products"
                    dataKey="value"
                    nameKey="name"
                    height={280}
                    fontSize={10}
                    legendFontSize={11}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-lg border bg-white p-6">
                    <p className="text-muted-foreground text-sm">
                      No revenue distribution data available
                    </p>
                  </div>
                )}
              </div>
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

              {/* Category Details Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th
                            className="cursor-pointer px-4 py-3 text-left text-sm font-medium hover:bg-gray-50"
                            onClick={() => handleSort("categoryName")}
                          >
                            <div className="flex items-center gap-2">
                              Category
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th
                            className="cursor-pointer px-4 py-3 text-right text-sm font-medium hover:bg-gray-50"
                            onClick={() => handleSort("totalRevenue")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Revenue
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th
                            className="cursor-pointer px-4 py-3 text-right text-sm font-medium hover:bg-gray-50"
                            onClick={() => handleSort("totalQuantity")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Units Sold
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th
                            className="cursor-pointer px-4 py-3 text-right text-sm font-medium hover:bg-gray-50"
                            onClick={() => handleSort("orderCount")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Total Orders
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                          <th
                            className="cursor-pointer px-4 py-3 text-right text-sm font-medium hover:bg-gray-50"
                            onClick={() => handleSort("avgOrderValue")}
                          >
                            <div className="flex items-center justify-end gap-2">
                              Avg. Order Value
                              <ArrowUpDown className="h-4 w-4" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCategories.map((category) => {
                          const avgOrderValue =
                            category.orderCount > 0
                              ? Math.round(
                                  category.totalRevenue / category.orderCount,
                                )
                              : 0;

                          return (
                            <tr
                              key={category.categoryId}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm font-medium">
                                {category.categoryName}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                Rp{" "}
                                {(category.totalRevenue || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                {(category.totalQuantity || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                {(category.orderCount || 0).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                              <td className="px-4 py-3 text-right text-sm">
                                Rp {avgOrderValue.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
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
