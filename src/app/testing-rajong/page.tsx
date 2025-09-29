/* src/app/testing-rajong/page.tsx  –– tailwind version */
"use client";

import React, { useState } from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

type Option = { id: number; name: string };
type ApiResponse = { data: Option[] };

export default function CascadingDropdowns() {
  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");

  /* queries */
  const { data: provinces = [], isLoading: loadingP } = useQuery({
    queryKey: ["rajong-province"],
    queryFn: (() =>
      axiosInstance
        .get<ApiResponse>("/geocoding/rajong-province")
        .then((r) => r.data.data)) as () => Promise<Option[]>,
  });

  const { data: cities = [], isLoading: loadingC } = useQuery({
    queryKey: ["rajong-city", provinceId],
    queryFn: (() =>
      axiosInstance
        .get<ApiResponse>(`/geocoding/rajong-city?provinceId=${provinceId}`)
        .then((r) => r.data.data)) as () => Promise<Option[]>,
    enabled: !!provinceId,
  });

  const { data: districts = [], isLoading: loadingD } = useQuery({
    queryKey: ["rajong-district", cityId],
    queryFn: (() =>
      axiosInstance
        .get<ApiResponse>(`/geocoding/rajong-district?cityId=${cityId}`)
        .then((r) => r.data.data)) as () => Promise<Option[]>,
    enabled: !!cityId,
  });

  /* handlers */
  const handleProvince = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setProvinceId(val);
    setCityId("");
    setDistrictId("");
  };

  const handleCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCityId(val);
    setDistrictId("");
  };

  const handleDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictId(e.target.value);
  };

  /* reusable select */
  const Select = ({
    label,
    value,
    options,
    disabled,
    loading,
    onChange,
  }: {
    label: string;
    value: string;
    options: Option[];
    disabled?: boolean;
    loading?: boolean;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {loading && <span className="text-sm text-blue-600">Loading…</span>}
    </div>
  );

  return (
    <div className="mx-auto mt-10 max-w-xl space-y-6 rounded bg-white p-6 shadow">
      <h2 className="text-2xl font-bold text-gray-800">Cascading Dropdowns</h2>

      <div className="space-y-4">
        <Select
          label="Province"
          value={provinceId}
          options={provinces}
          loading={loadingP}
          onChange={handleProvince}
        />
        <Select
          label="City"
          value={cityId}
          options={cities}
          disabled={!provinceId}
          loading={loadingC}
          onChange={handleCity}
        />
        <Select
          label="District"
          value={districtId}
          options={districts}
          disabled={!cityId}
          loading={loadingD}
          onChange={handleDistrict}
        />
      </div>

      <div className="rounded bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-700">Selected IDs</h3>
        <p className="text-sm text-gray-600">
          Province: {provinceId || "None"}
        </p>
        <p className="text-sm text-gray-600">City: {cityId || "None"}</p>
        <p className="text-sm text-gray-600">
          District: {districtId || "None"}
        </p>
      </div>
    </div>
  );
}
