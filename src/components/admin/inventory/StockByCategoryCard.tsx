import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventorySummary } from "@/types/admin/inventory";

interface StockByCategoryCardProps {
  summary: InventorySummary | null;
}

export default function StockByCategoryCard({
  summary,
}: StockByCategoryCardProps) {
  if (
    !summary?.stockByCategory ||
    summary.stockByCategory.length === 0
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock by Category</CardTitle>
        <CardDescription>
          Inventory distribution across product categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summary.stockByCategory.map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between"
            >
              <div>
                <h4 className="font-medium">{category.categoryName}</h4>
                <p className="text-sm text-gray-600">
                  {category.productCount} products
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{category.totalStock}</p>
                <p className="text-xs text-gray-500">units</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
