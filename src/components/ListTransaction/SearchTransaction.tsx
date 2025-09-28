import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState } from "react";

type SearchParams = {
  orderId?: string;
  startDate?: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd
};

type Props = {
  params?: SearchParams;
  onChange: (next: SearchParams) => void;
  debounceMs?: number;
};

export default function SearchTransaction({
  params,
  onChange,
  debounceMs = 400,
}: Props) {
  const [orderId, setOrderId] = useState(params?.orderId ?? "");
  const [startDate, setStartDate] = useState(params?.startDate ?? "");
  const [endDate, setEndDate] = useState(params?.endDate ?? "");

  useEffect(() => {
    setOrderId(params?.orderId ?? "");
    setStartDate(params?.startDate ?? "");
    setEndDate(params?.endDate ?? "");
  }, [params?.orderId, params?.startDate, params?.endDate]);

  const debouncedOrderId = useDebounce(orderId, debounceMs);
  const debouncedStartDate = useDebounce(startDate, debounceMs);
  const debouncedEndDate = useDebounce(endDate, debounceMs);

  useEffect(() => {
    onChange({
      orderId: debouncedOrderId?.trim() ? debouncedOrderId.trim() : undefined,
      startDate: debouncedStartDate?.trim() ? debouncedStartDate : undefined,
      endDate: debouncedEndDate?.trim() ? debouncedEndDate : undefined,
    });
  }, [debouncedOrderId, debouncedStartDate, debouncedEndDate, onChange]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
        {/* Order ID input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">Search by orderId</span>
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            placeholder="Enter order id..."
            aria-label="Search by order id"
          />
        </div>

        {/* Start Date input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">Start date</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onFocus={(e) => e.currentTarget.showPicker?.()} // 👈 auto buka kalender
            className="w-full cursor-pointer border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            aria-label="Filter by start date"
          />
        </div>

        {/* End Date input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">End date</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onFocus={(e) => e.currentTarget.showPicker?.()} // 👈 auto buka kalender
            className="w-full cursor-pointer border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            aria-label="Filter by end date"
          />
        </div>
      </div>
    </div>
  );
}
