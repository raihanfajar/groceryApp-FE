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

  const getStockColorClass = (
    afterStock: number,
    beforeStock: number,
    type: string,
    minStock?: number | null,
  ) => {
    // Determine if stock increased or decreased
    const stockIncreased = afterStock > beforeStock;
    const stockDecreased = afterStock < beforeStock;

    // If stock increased (IN, INITIAL, or positive ADJUSTMENT/TRANSFER)
    if (type === "IN" || type === "INITIAL" || stockIncreased) {
      return "text-green-600 font-semibold";
    }

    // If stock decreased
    if (stockDecreased || type === "OUT") {
      // Below minimum stock - critical (red)
      if (minStock && afterStock < minStock) {
        return "text-red-600 font-semibold";
      }
      // Above minimum but reduced - warning (yellow/amber)
      return "text-amber-600 font-semibold";
    }

    // No change or other types
    return "text-blue-600 font-medium";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-40 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Date & Time
                </th>
                <th className="w-50 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                {isSuper && (
                  <th className="w-44 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Store
                  </th>
                )}
                <th className="w-36 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Movement
                </th>
                <th className="w-28 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="w-28 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  Previous Stock
                </th>
                <th className="w-28 px-4 py-3 text-center text-sm font-medium text-gray-700">
                  New Stock
                </th>
                <th className="w-44 px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Admin
                </th>
                <th className="min-w-[200px] px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <div className="whitespace-nowrap">
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
                  <td className="max-w-50 px-4 py-3 text-sm">
                    <div className="max-w-full">
                      <div
                        className="truncate font-medium text-gray-900"
                        title={
                          entry.storeProduct?.product?.name || "Unknown Product"
                        }
                      >
                        {entry.storeProduct?.product?.name || "Unknown Product"}
                      </div>
                      <div
                        className="truncate text-xs text-gray-500"
                        title={
                          entry.storeProduct?.product?.category?.name ||
                          "No Category"
                        }
                      >
                        {entry.storeProduct?.product?.category?.name ||
                          "No Category"}
                      </div>
                    </div>
                  </td>
                  {isSuper && (
                    <td className="max-w-44 px-4 py-3 text-sm">
                      <div className="max-w-full">
                        <div
                          className="truncate font-medium text-gray-900"
                          title={
                            entry.storeProduct?.store?.name || "Unknown Store"
                          }
                        >
                          {entry.storeProduct?.store?.name || "Unknown Store"}
                        </div>
                        <div
                          className="truncate text-xs text-gray-500"
                          title={
                            entry.storeProduct?.store?.city &&
                            entry.storeProduct?.store?.province
                              ? `${entry.storeProduct.store.city}, ${entry.storeProduct.store.province}`
                              : "No Location"
                          }
                        >
                          {entry.storeProduct?.store?.city &&
                          entry.storeProduct?.store?.province
                            ? `${entry.storeProduct.store.city}, ${entry.storeProduct.store.province}`
                            : "No Location"}
                        </div>
                      </div>
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
                  <td className="px-4 py-3 text-center text-sm">
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
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                    {entry.beforeStock}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <span
                      className={getStockColorClass(
                        entry.afterStock,
                        entry.beforeStock,
                        entry.type,
                        entry.storeProduct?.minStock,
                      )}
                    >
                      {entry.afterStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="truncate">
                      <div
                        className="truncate font-medium text-gray-900"
                        title={entry.admin?.name || "System"}
                      >
                        {entry.admin?.name || "System"}
                      </div>
                      <div
                        className="truncate text-xs text-gray-500"
                        title={entry.admin?.email || "Automated"}
                      >
                        {entry.admin?.email || "Automated"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="line-clamp-2" title={entry.notes || "-"}>
                      {entry.notes || "-"}
                    </div>
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
