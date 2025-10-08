import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, DollarSign } from "lucide-react";
import { DiscountUsageHistory } from "@/types/discount";

interface UsageStatisticsProps {
  summary?: {
    totalDiscountGiven: number;
    totalOrderValue: number;
    totalUsages: number;
    averageDiscountPerOrder: number;
  };
  usageHistory: DiscountUsageHistory[];
}

export default function UsageStatistics({
  summary,
  usageHistory,
}: UsageStatisticsProps) {
  const uniqueUsers = new Set(
    usageHistory?.map((h) => h.userId).filter(Boolean),
  ).size;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-600">
                Rp {summary?.totalDiscountGiven?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600">Total Discount Given</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{uniqueUsers}</p>
              <p className="text-sm text-gray-600">Unique Users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {summary?.totalUsages || 0}
              </p>
              <p className="text-sm text-gray-600">Total Usage Count</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
