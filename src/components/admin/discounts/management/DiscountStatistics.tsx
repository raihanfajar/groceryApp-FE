import { Card, CardContent } from "@/components/ui/card";
import { Discount, DiscountType } from "@/types/discount";

interface DiscountStatisticsProps {
  discounts: Discount[];
}

export default function DiscountStatistics({
  discounts,
}: DiscountStatisticsProps) {
  const totalDiscounts = discounts.length;
  const activeDiscounts = discounts.filter((d) => d.isActive).length;
  const bogoDiscounts = discounts.filter(
    (d) => d.type === DiscountType.BOGO,
  ).length;
  const totalUsage = discounts.reduce((sum, d) => sum + d.currentUsageCount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-blue-600">
            {totalDiscounts}
          </div>
          <p className="text-sm text-gray-600">Total Discounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-green-600">
            {activeDiscounts}
          </div>
          <p className="text-sm text-gray-600">Active Discounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-purple-600">
            {bogoDiscounts}
          </div>
          <p className="text-sm text-gray-600">BOGO Discounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-orange-600">{totalUsage}</div>
          <p className="text-sm text-gray-600">Total Usage</p>
        </CardContent>
      </Card>
    </div>
  );
}
