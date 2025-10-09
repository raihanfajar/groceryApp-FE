"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetStoresWithin25km } from "@/hooks/home/useGetStoresWithin25km";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { MapPin } from "lucide-react";
import { useState } from "react";

export function StorePickerDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { accessToken, targetStore, setTargetStore } = useUserAuthStore();
  const { data: stores } = useGetStoresWithin25km(accessToken);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Choose another store (≤ 25 km)</DialogTitle>
        </DialogHeader>

        <div className="mt-4 grid gap-3">
          {stores?.map((s) => {
            const isActive = s.id === targetStore?.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setTargetStore({
                    id: s.id,
                    name: s.name,
                    distanceKm: s.distance / 1000,
                  });
                  setOpen(false);
                }}
                className={`hover:bg-accent flex items-center justify-between rounded-lg border p-3 text-left transition ${
                  isActive ? "border-primary" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-muted-foreground text-xs">{s.address}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs">
                  {(s.distance / 1000).toFixed(1)} km
                </span>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
