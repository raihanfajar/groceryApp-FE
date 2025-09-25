"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import StockJournalHeader from "@/components/admin/inventory/StockJournalHeader";
import StockJournalFilters from "@/components/admin/inventory/StockJournalFilters";
import StockJournalTable from "@/components/admin/inventory/StockJournalTable";
import StockJournalEmptyState from "@/components/admin/inventory/StockJournalEmptyState";
import StockJournalPagination from "@/components/admin/inventory/StockJournalPagination";
import { useStockJournal } from "@/hooks/useStockJournal";

export default function StockJournalPage() {
  const {
    entries,
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    admin,
    handleSearch,
    handleProductFilter,
    handleCategoryFilter,
    handleStoreFilter,
    handleTypeFilter,
    handleDateRangeFilter,
    handlePageChange,
  } = useStockJournal();

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <StockJournalHeader
          isSuper={admin.isSuper || false}
          storeName={admin.store?.name}
        />

        <StockJournalFilters
          filters={filters}
          products={products}
          categories={categories}
          stores={stores}
          isSuper={admin.isSuper || false}
          onSearch={handleSearch}
          onProductFilter={handleProductFilter}
          onCategoryFilter={handleCategoryFilter}
          onStoreFilter={handleStoreFilter}
          onTypeFilter={handleTypeFilter}
          onDateRangeFilter={handleDateRangeFilter}
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : entries.length === 0 ? (
          <StockJournalEmptyState />
        ) : (
          <StockJournalTable
            entries={entries}
            isSuper={admin.isSuper || false}
          />
        )}

        <StockJournalPagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
}
