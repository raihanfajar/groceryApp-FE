"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useDiscountHistory } from "@/hooks/admin/useDiscountHistory";
import UsageStatistics from "./history/UsageStatistics";
import HistoryTable from "./history/HistoryTable";
import EmptyHistoryState from "./history/EmptyHistoryState";

export default function DiscountHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { admin } = useAdminAuthStore();

  const { data: historyData, isLoading } = useDiscountHistory(
    admin?.id,
    admin?.store?.id,
    admin?.accessToken,
  );

  const usageHistory = historyData?.data || [];

  const filteredHistory = usageHistory.filter(
    (history) =>
      history.discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.user?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">
            Loading discount history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search discount usage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="text-sm text-gray-600">
          Total Records: {historyData?.pagination?.total || 0}
          {historyData?.pagination && historyData.pagination.totalPages > 1 && (
            <span className="ml-2 text-gray-400">
              (Showing {usageHistory?.length || 0})
            </span>
          )}
        </div>
      </div>

      <UsageStatistics
        summary={historyData?.summary}
        usageHistory={usageHistory}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Discount Usage History ({filteredHistory?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length > 0 ? (
            <HistoryTable history={filteredHistory} />
          ) : (
            <EmptyHistoryState hasSearchTerm={!!searchTerm} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
