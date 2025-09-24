import { Badge } from "@/components/ui/badge";
import { StockJournalEntry } from "@/types/admin/inventory";
import { formatDistanceToNow } from "date-fns";
import {
  TrendingUp,
  TrendingDown,
  RotateCcw,
  RefreshCw,
  Package,
} from "lucide-react";

interface StockJournalTableProps {
  entries: StockJournalEntry[];
  isSuper: boolean;
}

const StockJournalTable: React.FC<StockJournalTableProps> = ({
  entries,
  isSuper,
}) => {
  const getMovementIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "OUT":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "ADJUSTMENT":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case "TRANSFER":
        return <RotateCcw className="h-4 w-4 text-yellow-600" />;
      case "INITIAL":
        return <Package className="h-4 w-4 text-gray-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMovementBadgeVariant = (type: string) => {
    switch (type) {
      case "IN":
        return "default";
      case "OUT":
        return "destructive";
      case "ADJUSTMENT":
        return "secondary";
      case "TRANSFER":
        return "outline";
      case "INITIAL":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatQuantity = (quantity: number, type: string) => {
    const sign =
      type === "IN" || type === "INITIAL" ? "+" : type === "OUT" ? "-" : "";
    return `${sign}${Math.abs(quantity)}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                {isSuper && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Store
                  </th>
                )}
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Movement
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Previous Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  New Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Admin
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-gray-500">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(entry.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.storeProduct?.product?.name || "Unknown Product"}
                      </div>
                      <div className="text-gray-500">Category Information</div>
                    </div>
                  </td>
                  {isSuper && (
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-gray-900">
                        {entry.storeProduct?.store?.name || "Unknown Store"}
                      </div>
                      <div className="text-gray-500">Store Location</div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      {getMovementIcon(entry.type)}
                      <Badge
                        variant={
                          getMovementBadgeVariant(entry.type) as
                            | "default"
                            | "destructive"
                            | "secondary"
                            | "outline"
                        }
                      >
                        {entry.type}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`font-medium ${
                        entry.type === "IN" || entry.type === "INITIAL"
                          ? "text-green-600"
                          : entry.type === "OUT"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    >
                      {formatQuantity(entry.quantity, entry.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {entry.beforeStock}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {entry.afterStock}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.admin?.name || "System"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.admin?.email || "Automated"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {entry.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockJournalTable;
