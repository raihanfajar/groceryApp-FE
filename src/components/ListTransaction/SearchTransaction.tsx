import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect, useState, useRef } from "react";

export type SearchParams = {
  orderId?: string;
  startDate?: string;
  endDate?: string;
};

type Props = {
  params: SearchParams;
  onChange: (next: SearchParams) => void;
  debounceMs?: number;
};

export default function SearchTransaction({
  params,
  onChange,
  debounceMs = 400,
}: Props) {
  const [values, setValues] = useState(params);
  const debouncedValues = useDebounce(values, debounceMs);
  const isInitialMount = useRef(true);

  useEffect(() => {
    setValues(params);
  }, [params]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onChange(debouncedValues);
  }, [debouncedValues, onChange]);

  const handleChange = (field: keyof SearchParams, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-3">
        {/* Order ID Input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">Search by orderId</span>
          </label>
          <input
            type="text"
            value={values.orderId ?? ""}
            onChange={(e) => handleChange("orderId", e.target.value)}
            className="w-full border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
            placeholder="Enter order id..."
          />
        </div>
        {/* Start Date Input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">Start date</span>
          </label>
          <input
            type="date"
            value={values.startDate ?? ""}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full cursor-pointer border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
          />
        </div>
        {/* End Date Input */}
        <div className="form-control w-full rounded-md border p-4 shadow-xs">
          <label className="label pb-0">
            <span className="label-text">End date</span>
          </label>
          <input
            type="date"
            value={values.endDate ?? ""}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full cursor-pointer border-b-2 px-2 py-1 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
