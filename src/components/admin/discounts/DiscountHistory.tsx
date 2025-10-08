"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Clock, User, DollarSign } from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { DiscountUsageHistory, DiscountType } from "@/types/discount";

export default function DiscountHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { admin } = useAdminAuthStore();

  // Fetch discount usage history
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["discountHistory", admin?.id, admin?.store?.id],
    queryFn: async () => {
      const response = await axiosInstance.get("/discounts/report/usage", {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
        params: {
          limit: 100, // Get more records for history view
        },
      });
      console.log("Discount history response:", response.data);
      const result = response.data as {
        status: string;
        data: {
          data: DiscountUsageHistory[];
          pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
          };
          summary: {
            totalDiscountGiven: number;
            totalOrderValue: number;
            totalUsages: number;
            averageDiscountPerOrder: number;
          };
        };
      };
      return result.data;
    },
    enabled: !!admin?.accessToken,
  });

  const usageHistory = historyData?.data || [];

  const filteredHistory = (usageHistory || []).filter(
    (history) =>
      history.discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.user?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDiscountTypeColor = (type: DiscountType) => {
    switch (type) {
      case DiscountType.MANUAL:
        return "bg-blue-100 text-blue-800";
      case DiscountType.MINIMUM_PURCHASE:
        return "bg-green-100 text-green-800";
      case DiscountType.BOGO:
        return "bg-purple-100 text-purple-800";
      case DiscountType.REGULAR:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDiscountTypeLabel = (type: DiscountType) => {
    switch (type) {
      case DiscountType.MANUAL:
        return "Manual";
      case DiscountType.MINIMUM_PURCHASE:
        return "Min Purchase";
      case DiscountType.BOGO:
        return "BOGO";
      case DiscountType.REGULAR:
        return "Regular";
      default:
        return type;
    }
  };

  if (isLoadingHistory) {
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
      {/* Header Actions */}
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

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">
                  Rp{" "}
                  {historyData?.summary?.totalDiscountGiven?.toLocaleString() ||
                    0}
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
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(usageHistory?.map((h) => h.userId).filter(Boolean))
                    .size || 0}
                </p>
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
                  {historyData?.summary?.totalUsages || 0}
                </p>
                <p className="text-sm text-gray-600">Total Usage Count</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Discount Usage History ({filteredHistory?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory && filteredHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Discount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Discount Value</TableHead>
                  <TableHead>Order Total</TableHead>
                  <TableHead>Applied By</TableHead>
                  <TableHead>Date Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>
                      <div className="font-medium">{history.discount.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getDiscountTypeColor(history.discount.type)}
                      >
                        {getDiscountTypeLabel(history.discount.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {history.user ? (
                        <div>
                          <div className="font-medium">{history.user.name}</div>
                          <div className="text-sm text-gray-500">
                            {history.user.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3 text-green-600" />
                        <span className="font-medium text-green-600">
                          Rp {history.discountValue.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        Rp {history.orderTotal.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      {history.appliedBy ? (
                        <div className="text-sm">
                          <div className="font-medium">Manual</div>
                          <div className="text-gray-500">
                            by {history.appliedBy.name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          System Applied
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <div>
                          <div>
                            {new Date(history.usedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(history.usedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No usage history found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Discount usage will appear here when customers use discounts or when admins apply them manually."}
              </p>
              {!searchTerm && (
                <div className="mt-4 rounded-md bg-blue-50 p-3 text-left">
                  <p className="text-xs text-blue-700">
                    <strong>💡 Tip:</strong> To see discount usage:
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-600">
                    <li>Create an active discount</li>
                    <li>Have customers apply it during checkout</li>
                    <li>Or manually apply discounts to orders</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
