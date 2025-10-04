"use client";
import MapLeaflet from "@/components/homePage/location/MapLeaflet";
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
import { RajongSelectGroupWithNames } from "./RajongSelectGroupWithNames";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: StoreFormData;
  setFormData: (data: StoreFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding?: boolean;
}

export function AddStoreDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isAdding,
}: Props) {
  /* map pin -> lat/lng */
  const handleMapPin = (lat: number, lng: number) => {
    setFormData({ ...formData, lat: String(lat), lng: String(lng) });
  };

  /* single helper that writes BOTH id & name */
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
      <DialogTrigger asChild>
        <Button className="ml-4 bg-green-700 hover:bg-black">
          <Plus className="mr-2 h-4 w-4" />
          Add Store
        </Button>
      </DialogTrigger>

      {/* scrollable content */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Store</DialogTitle>
            <DialogDescription>
              Fill details and drop a pin on the map.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Store Name */}
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

            {/* Rajong Cascade (id + name) */}
            <RajongSelectGroupWithNames
              provinceId={formData.provinceId}
              cityId={formData.cityId}
              districtId={formData.districtId}
              onChange={(level, id, name) =>
                handleRajongChange(level, id, name)
              }
            />

            {/* Lat / Lng (read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-extrabold text-green-700">
                  Latitude
                </Label>
                <Input
                  value={formData.lat}
                  readOnly
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
                  className="border-black bg-gray-100 font-mono text-sm"
                />
              </div>
            </div>

            {/* Map */}
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
            <Button
              type="submit"
              className="bg-green-700 hover:bg-black"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add Store"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
