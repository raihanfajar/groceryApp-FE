import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
          <div className="divide-y">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2 py-4 first:pt-0">
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
          <>
            <div className="max-h-[320px] divide-y overflow-y-auto">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="py-4 first:pt-0 last:pb-0">
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
                    {transaction.userProfilePicture ? (
                      <Image
                        src={transaction.userProfilePicture}
                        alt={transaction.userName}
                        width={24}
                        height={24}
                        className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                        {transaction.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                    )}
                    <span className="font-medium">{transaction.userName}</span>
                    <span>•</span>
                    <span>{transaction.userEmail}</span>
                  </div>

                  {/* Store & Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-600">
                      {transaction.storeName}
                    </span>
                    <span>•</span>
                    <span>{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-4 pt-4">
              <Link
                href="/admin/transactions"
                className="flex w-full items-center justify-center rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                View All Transactions
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
