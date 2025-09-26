"use client";
import SearchTransaction from "@/components/ListTransaction/SearchTransaction";
import LeftNavUserProfile from "@/components/userProfile/LeftNavUserProfile";
import { useState } from "react";

const WaitingForPaymentPage = () => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 5,
    status: "completed",
    orderId: "",
    startDate: "",
    endDate: "",
  });

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
        </section>
      </div>
    </main>
  );
};

export default WaitingForPaymentPage;
