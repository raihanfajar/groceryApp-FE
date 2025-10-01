// RajongSelectGroup.tsx  (shadcn version – no Formik inside)
"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/hooks/rajong/types";
import { useRajongCity } from "@/hooks/rajong/useRajongCity";
import { useRajongDistrict } from "@/hooks/rajong/useRajongDistrict";
import { useRajongProvince } from "@/hooks/rajong/useRajongProvince";
import { memo } from "react";

type Props = {
  provinceId: string;
  setProvinceId: (v: string) => void;
  cityId: string;
  setCityId: (v: string) => void;
  districtId: string;
  setDistrictId: (v: string) => void;
};

export const RajongSelectGroup = memo(function RajongSelectGroup({
  provinceId,
  setProvinceId,
  cityId,
  setCityId,
  districtId,
  setDistrictId,
}: Props) {
  const { data: provinces = [], isLoading: loadingP } = useRajongProvince();
  const { data: cities = [], isLoading: loadingC } = useRajongCity(provinceId);
  const { data: districts = [], isLoading: loadingD } =
    useRajongDistrict(cityId);

  /* ---- handlers ---- */
  const handleProvince = (val: string) => {
    setProvinceId(val);
    setCityId("");
    setDistrictId("");
  };
  const handleCity = (val: string) => {
    setCityId(val);
    setDistrictId("");
  };
  const handleDistrict = (val: string) => {
    setDistrictId(val);
  };

  /* ---- reusable shadcn select ---- */
  const ShadcnSelect = ({
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
    onChange: (val: string) => void;
  }) => (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-700">{label}</label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        {/* height cap – tweak max-h-xxx as needed */}
        <SelectContent className="max-h-60 overflow-y-auto">
          {options.map((o) => (
            <SelectItem key={o.id} value={String(o.id)}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <span className="text-sm text-blue-600">Loading…</span>}
    </div>
  );

  return (
    <div className="space-y-4">
      <ShadcnSelect
        label="Province"
        value={provinceId}
        options={provinces}
        loading={loadingP}
        onChange={handleProvince}
      />
      <ShadcnSelect
        label="City"
        value={cityId}
        options={cities}
        disabled={!provinceId}
        loading={loadingC}
        onChange={handleCity}
      />
      <ShadcnSelect
        label="District"
        value={districtId}
        options={districts}
        disabled={!cityId}
        loading={loadingD}
        onChange={handleDistrict}
      />
    </div>
  );
});
