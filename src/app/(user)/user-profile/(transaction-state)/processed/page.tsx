"use client";
import SearchTransaction from "@/components/ListTransaction/SearchTransaction";
import UserTransactionList from "@/components/ListTransaction/UserTransactionList";
import LeftNavUserProfile from "@/components/userProfile/LeftNavUserProfile";
import { useUserTransactionsQuery } from "@/hooks/transaction/useTransaction";
import Image from "next/image";
import { useState } from "react";

const ProcessedPage = () => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 5,
    status: "on_process",
    orderId: "",
    startDate: "",
    endDate: "",
  });

  // 🔹 call hook
  const { data, isLoading, isError } = useUserTransactionsQuery(params);

  const page = params.page;
  const pageSize = params.pageSize;
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goPrev = () => {
    if (page <= 1) return;
    setParams((p) => ({ ...p, page: p.page - 1 }));
  };

  const goNext = () => {
    if (page >= totalPages) return;
    setParams((p) => ({ ...p, page: p.page + 1 }));
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-100px)] bg-[#f9fafb] md:px-8 lg:px-16">
      <div className="flex flex-col gap-6 p-4 md:flex-row">
        {/* Left Navigation */}
        <aside className="hidden h-fit w-full lg:block lg:w-1/5">
          <LeftNavUserProfile />
        </aside>

        {/* Main Content */}
        <section className="w-full overflow-hidden rounded-lg border bg-white p-6 shadow-md">
          <SearchTransaction
            params={{
              orderId: params.orderId,
              startDate: params.startDate,
              endDate: params.endDate,
            }}
            debounceMs={300}
            onChange={(next) =>
              setParams((p) => ({
                ...p,
                ...next,
                page: 1,
              }))
            }
          />

          {/* 🔹 Render content */}
          {isLoading ? (
            <div className="mt-20 flex items-center justify-center">
              Loading...
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load transactions.</p>
          ) : data && data.data && data.data.length > 0 ? (
            <div className="mt-4 space-y-4">
              {data.data.map((tx) => (
                <UserTransactionList key={tx.id} transaction={tx} />
              ))}

              {/* Simple pagination: Prev / Current / Next */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  className="btn"
                  onClick={goPrev}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                <div className="text-sm text-gray-600">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </div>

                <button
                  className="btn"
                  onClick={goNext}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center justify-center text-center">
              <Image
                src="/empty-orders.png"
                alt="No orders"
                height={200}
                width={200}
              />
              <p className="mt-4 text-gray-500">No orders found</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProcessedPage;
