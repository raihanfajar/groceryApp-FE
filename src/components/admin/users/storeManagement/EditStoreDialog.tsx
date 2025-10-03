"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoreFormData } from "../typesAndInterfaces";
import { DetailedStoreInfo } from "../typesAndInterfaces";
import { RajongSelectGroup } from "@/components/homePage/location/RajongSelectGroup";
import MapLeaflet from "@/components/homePage/location/MapLeaflet";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StoreFormData;
  setFormData: (data: StoreFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingStore: DetailedStoreInfo | null;
}

export function EditStoreDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  editingStore,
}: Props) {
  if (!editingStore) return null;

  /* ---- detect changes ---- */
  const hasChanges =
    formData.name !== editingStore.name ||
    formData.province !== editingStore.province ||
    formData.city !== editingStore.city ||
    formData.district !== editingStore.district ||
    formData.lat !== String(editingStore.lat) ||
    formData.lng !== String(editingStore.lng);

  /* ---- map pin handler ---- */
  const handleMapPin = (lat: number, lng: number) => {
    setFormData({ ...formData, lat: String(lat), lng: String(lng) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* ---- store name ---- */}
          <div className="space-y-2">
            <Label className="text-sm font-extrabold text-green-700">
              Store Name
            </Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
            />
          </div>

          {/* ---- rajong cascade ---- */}
          <RajongSelectGroup
            provinceId={formData.province}
            setProvinceId={(v: string) =>
              setFormData({ ...formData, province: v, city: "", district: "" })
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

          {/* ---- lat / lng ---- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-extrabold text-green-700">
                Latitude
              </Label>
              <Input
                value={formData.lat}
                readOnly
                className="border-black bg-gray-100 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-extrabold text-green-700">
                Longitude
              </Label>
              <Input
                value={formData.lng}
                readOnly
                className="border-black bg-gray-100 font-mono text-sm"
              />
            </div>
          </div>

          {/* ---- map ---- */}
          <MapLeaflet onLocationChange={handleMapPin} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-700 hover:bg-black"
              disabled={!hasChanges}
            >
              Update Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
