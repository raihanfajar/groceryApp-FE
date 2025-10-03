"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { StoreFormData } from "../typesAndInterfaces";
import { RajongSelectGroup } from "@/components/homePage/location/RajongSelectGroup";
import MapLeaflet from "@/components/homePage/location/MapLeaflet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StoreFormData;
  setFormData: (data: StoreFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AddStoreDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
}: Props) {
  /* ---- map callback ---- */
  const handleMapPin = (lat: number, lng: number) => {
    setFormData({ ...formData, lat: String(lat), lng: String(lng) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="ml-4 bg-green-700 hover:bg-black">
          <Plus className="mr-2 h-4 w-4" />
          Add Store
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
            <DialogDescription>
              Fill details and drop a pin on the map.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* ---- store name ---- */}
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Store Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter store name"
                required
                className="border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
              />
            </div>

            {/* ---- rajong cascade ---- */}
            <RajongSelectGroup
              provinceId={formData.province}
              setProvinceId={(v: string) =>
                setFormData({
                  ...formData,
                  province: v,
                  city: "",
                  district: "",
                })
              }
              cityId={formData.city}
              setCityId={(v: string) =>
                setFormData({ ...formData, city: v, district: "" })
              }
              districtId={formData.district}
              setDistrictId={(v: string) =>
                setFormData({ ...formData, district: v })
              }
            />

            {/* ---- lat / lng read-only (populated by map) ---- */}
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Latitude
              </Label>
              <Input
                value={formData.lat}
                readOnly
                placeholder="Click map"
                className="border-black bg-gray-100 font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Longitude
              </Label>
              <Input
                value={formData.lng}
                readOnly
                placeholder="Click map"
                className="border-black bg-gray-100 font-mono text-sm"
              />
            </div>

            {/* ---- map ---- */}
            <MapLeaflet onLocationChange={handleMapPin} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-black">
              Add Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
