"use client";
import MapLeafletNoSSR from "./MapLeafletNoSSR";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailedStoreInfo, StoreFormData } from "../typesAndInterfaces";
import { RajongSelectGroupWithNames } from "./RajongSelectGroupWithNames";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StoreFormData;
  setFormData: (data: StoreFormData) => void;
  onSubmit: (e: React.FormEvent, storeId: string) => void;
  editingStore: DetailedStoreInfo | null;
  isUpdating?: boolean;
  onPin: (lat: number, lng: number) => void;
}

export function EditStoreDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  editingStore,
  isUpdating,
  onPin,
}: Props) {
  if (!editingStore) return null;

  // !Changes detection
  const hasChanges =
    formData.name !== editingStore.name ||
    formData.provinceId !== String(editingStore.provinceId) ||
    formData.cityId !== String(editingStore.cityId) ||
    formData.districtId !== String(editingStore.districtId) ||
    formData.lat !== String(editingStore.lat) ||
    formData.lng !== String(editingStore.lng);

  // !Map pin handler
  const handleMapPin = onPin;

  // !Rajong cascade handler
  const handleRajongChange = (
    level: "province" | "city" | "district",
    id: string,
    name: string,
  ) => {
    setFormData({
      ...formData,
      [`${level}Id`]: id,
      [level]: name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]"
      >
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => onSubmit(e, editingStore!.id)}
          className="space-y-4"
        >
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
          <RajongSelectGroupWithNames
            provinceId={formData.provinceId}
            cityId={formData.cityId}
            districtId={formData.districtId}
            onChange={(level, id, name) => handleRajongChange(level, id, name)}
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
          <MapLeafletNoSSR onLocationChange={handleMapPin} />

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
              disabled={!hasChanges || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
