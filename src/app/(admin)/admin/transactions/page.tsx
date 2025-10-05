"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import EmptyTransactionList from "@/components/admin/transaction/EmptyTransactionList";
import TransactionListHeader from "@/components/admin/transaction/TransactionListHeader";
import TransactionListSearch, {
  TransactionFilters,
} from "@/components/admin/transaction/TransactionListSearch";
import { TransactionTable } from "@/components/admin/transaction/TransactionTable";
import { useStoreTransactionsQuery } from "@/hooks/admin/transaction/adminTransaction";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    startDate: "",
    endDate: "",
    status: "all",
    storeId: "all",
  });

  const { data, isLoading } = useStoreTransactionsQuery(filters);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
  }, [isAuthenticated, router]);

  if (isLoading || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  const transactions = data?.data ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <TransactionListHeader />

        {/* Filters */}
        <TransactionListSearch
          filters={filters}
          isSuper={admin.isSuper}
          onSearch={(searchTerm) =>
            setFilters((prev) => ({ ...prev, search: searchTerm }))
          }
          onStatusChange={(status) =>
            setFilters((prev) => ({ ...prev, status }))
          }
          onStartDateChange={(startDate) =>
            setFilters((prev) => ({ ...prev, startDate }))
          }
          onEndDateChange={(endDate) =>
            setFilters((prev) => ({ ...prev, endDate }))
          }
          onStoreIdChange={(storeId) =>
            setFilters((prev) => ({ ...prev, storeId }))
          }
        />

        {/* Table */}
        {transactions.length > 0 ? (
          <TransactionTable
            transactions={transactions}
            isSuper={admin.isSuper}
          />
        ) : (
          <EmptyTransactionList />
        )}
      </div>
    </AdminLayout>
  );
}

export default Page;
