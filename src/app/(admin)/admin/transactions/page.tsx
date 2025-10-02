"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import TransactionListHeader from "@/components/admin/transaction/TransactionListHeader";
import TransactionListSearch, {
  TransactionFilters,
} from "@/components/admin/transaction/TransactionListSearch";
// import { useStoreTransactionsQuery } from "@/hooks/admin/transaction/adminTransaction";
// import { useAdminAuthStore } from "@/store/useAdminAuthStore";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";

function Page() {
  // const router = useRouter();
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    startDate: "",
    endDate: "",
    status: "all",
  });
  // const { admin, isAuthenticated } = useAdminAuthStore();

  // const { data, isLoading } = useStoreTransactionsQuery(filters);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <TransactionListHeader />

        {/* Filters */}
        <TransactionListSearch
          filters={filters}
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
        />

        {/* Table */}
      </div>
    </AdminLayout>
  );
}

export default Page;
