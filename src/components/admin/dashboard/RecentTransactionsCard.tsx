import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, User, Package } from "lucide-react";
import Link from "next/link";
import {
  RecentTransaction,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
} from "@/types/admin/dashboard";

interface RecentTransactionsCardProps {
  transactions: RecentTransaction[];
  isLoading?: boolean;
}

export default function RecentTransactionsCard({
  transactions,
  isLoading,
}: RecentTransactionsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
        <CardDescription>Latest customer orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-3">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="h-3 w-24 animate-pulse rounded bg-gray-100"></div>
                <div className="h-3 w-40 animate-pulse rounded bg-gray-100"></div>
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-center">
            <Package className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">No recent transactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                {/* Header: Transaction Number & Status */}
                <div className="mb-2 flex items-center justify-between">
                  <Link
                    href={`/admin/transactions/${transaction.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {transaction.transactionNumber}
                  </Link>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      TRANSACTION_STATUS_COLORS[transaction.status]
                    }`}
                  >
                    {TRANSACTION_STATUS_LABELS[transaction.status]}
                  </span>
                </div>

                {/* User Info */}
                <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{transaction.userName}</span>
                  <span>•</span>
                  <span>{transaction.userEmail}</span>
                </div>

                {/* Products */}
                <div className="mb-2">
                  <p className="text-xs text-gray-500">
                    {transaction.products.length} product(s):{" "}
                    <span className="font-medium text-gray-700">
                      {transaction.products
                        .slice(0, 2)
                        .map((p) => p.productName)
                        .join(", ")}
                      {transaction.products.length > 2 &&
                        ` +${transaction.products.length - 2} more`}
                    </span>
                  </p>
                </div>

                {/* Footer: Date & Price */}
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
