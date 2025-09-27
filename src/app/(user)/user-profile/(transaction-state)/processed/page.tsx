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
            <div className="mt-20 flex items-center justify-center text-center">
              <span className="loading loading-ring loading-xs"></span>
              <span className="loading loading-ring loading-sm"></span>
              <span className="loading loading-ring loading-md"></span>
              <span className="loading loading-ring loading-lg"></span>
              <span className="loading loading-ring loading-xl"></span>
            </div>
          ) : isError ? (
            <p className="text-red-500">Failed to load transactions.</p>
          ) : data && data.data.length > 0 ? (
            <div className="mt-4 space-y-4">
              {data.data.map((tx) => (
                <UserTransactionList key={tx.id} transaction={tx} />
              ))}
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
