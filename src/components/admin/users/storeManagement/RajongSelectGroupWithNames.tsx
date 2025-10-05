"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRajongProvince } from "@/hooks/rajong/useRajongProvince";
import { useRajongCity } from "@/hooks/rajong/useRajongCity";
import { useRajongDistrict } from "@/hooks/rajong/useRajongDistrict";

interface Props {
  provinceId: string;
  cityId: string;
  districtId: string;
  onChange: (
    level: "province" | "city" | "district",
    id: string,
    name: string,
  ) => void;
}

export function RajongSelectGroupWithNames({
  provinceId,
  cityId,
  districtId,
  onChange,
}: Props) {
  const { data: provinces = [], isLoading: loadingP } = useRajongProvince();
  const { data: cities = [], isLoading: loadingC } = useRajongCity(provinceId);
  const { data: districts = [], isLoading: loadingD } = useRajongDistrict(cityId); //prettier-ignore

  // !Convert id jadi string
  const provinceOpts = provinces.map((p) => ({ ...p, id: String(p.id) }));
  const cityOpts = cities.map((c) => ({ ...c, id: String(c.id) }));
  const districtOpts = districts.map((d) => ({ ...d, id: String(d.id) }));

  // !StringSelect (local aja disini)
  const StringSelect = ({
    label,
    value,
    options,
    disabled,
    loading,
    onChange,
  }: {
    label: string;
    value: string;
    options: { id: string; name: string }[];
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
        <SelectContent className="max-h-60 overflow-y-auto">
          {options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {loading && <span className="text-sm text-blue-600">Loading…</span>}
    </div>
  );

  // !Cascade dropdown
  return (
    <div className="space-y-4">
      <StringSelect
        label="Province"
        value={provinceId}
        options={provinceOpts}
        loading={loadingP}
        onChange={(id) => {
          onChange(
            "province",
            id,
            provinceOpts.find((p) => p.id === id)?.name ?? "",
          );
        }}
      />
      <StringSelect
        label="City"
        value={cityId}
        options={cityOpts}
        disabled={!provinceId}
        loading={loadingC}
        onChange={(id) => {
          onChange("city", id, cityOpts.find((c) => c.id === id)?.name ?? "");
        }}
      />
      <StringSelect
        label="District"
        value={districtId}
        options={districtOpts}
        disabled={!cityId}
        loading={loadingD}
        onChange={(id) => {
          onChange(
            "district",
            id,
            districtOpts.find((d) => d.id === id)?.name ?? "",
          );
        }}
      />
    </div>
  );
}
