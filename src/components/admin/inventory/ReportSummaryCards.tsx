import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventorySummary } from "@/types/admin/inventory";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

interface ReportSummaryCardsProps {
  summary: InventorySummary | null;
}

const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ summary }) => {
  const summaryData = [
    {
      title: "Total Products",
      value: summary?.totalProducts || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Stock Quantity",
      value: summary?.totalStock || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Low Stock Items",
      value: summary?.lowStockProducts || 0,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Out of Stock",
      value: summary?.outOfStockProducts || 0,
      icon: AlertTriangle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${item.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value.toLocaleString()}
              </div>
              {summary && (
                <p className="mt-1 text-xs text-gray-500">
                  {index === 0 && "Active products in inventory"}
                  {index === 1 && "Total units across all products"}
                  {index === 2 && "Items requiring restocking"}
                  {index === 3 && "Items completely out of stock"}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;
