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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StoreAdmin } from "./typesAndInterfaces";

interface EditStoreAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stores: { id: string; name: string; city: string; province: string }[];
  formData: { name: string; email: string; storeId: string };
  setFormData: (data: { name: string; email: string; storeId: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingStoreAdmin: StoreAdmin | null;
}

export function EditStoreAdminDialog({
  open,
  onOpenChange,
  stores,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  editingStoreAdmin,
}: EditStoreAdminDialogProps) {
  if (!editingStoreAdmin) return null; // don't render if nothing selected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Store Admin</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-store">Store</Label>
            <Select
              value={formData.storeId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name} - {store.city}, {store.province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Store Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
