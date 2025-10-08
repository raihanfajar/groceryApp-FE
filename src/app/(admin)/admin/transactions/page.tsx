"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import EmptyTransactionList from "@/components/admin/transaction/EmptyTransactionList";
import TransactionListHeader from "@/components/admin/transaction/TransactionListHeader";
import TransactionListSearch, {
  TransactionFilters,
} from "@/components/admin/transaction/TransactionListSearch";
import TransactionTable from "@/components/admin/transaction/TransactionTable";
import { useStoreTransactionsQuery } from "@/hooks/admin/transaction/adminTransaction";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<Omit<TransactionFilters, "page">>({
    search: "",
    startDate: "",
    endDate: "",
    status: "all",
    storeId: "all",
  });

  const { data, isLoading } = useStoreTransactionsQuery({
    ...filters,
    page: currentPage,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
  }, [isAuthenticated, router]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

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
        <TransactionListHeader />

        <TransactionListSearch
          filters={filters}
          isSuper={admin.isSuper}
          onSearch={(searchTerm) => {
            setFilters((prev) => ({ ...prev, search: searchTerm }));
            setCurrentPage(1);
          }}
          onStatusChange={(status) => {
            setFilters((prev) => ({ ...prev, status }));
            setCurrentPage(1);
          }}
          onStartDateChange={(startDate) => {
            setFilters((prev) => ({ ...prev, startDate }));
            setCurrentPage(1);
          }}
          onEndDateChange={(endDate) => {
            setFilters((prev) => ({ ...prev, endDate }));
            setCurrentPage(1);
          }}
          onStoreIdChange={(storeId) => {
            setFilters((prev) => ({ ...prev, storeId }));
            setCurrentPage(1);
          }}
        />

        {/* Table */}
        {transactions.length > 0 ? (
          <TransactionTable
            transactions={transactions}
            isSuper={admin.isSuper}
            meta={data?.meta}
            onPageChange={handlePageChange}
          />
        ) : (
          <EmptyTransactionList />
        )}
      </div>
    </AdminLayout>
  );
}

export default Page;
