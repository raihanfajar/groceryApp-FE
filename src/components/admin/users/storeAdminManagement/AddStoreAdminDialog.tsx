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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Plus } from "lucide-react";
import { CreateStoreAdminData } from "../typesAndInterfaces";
import { useState } from "react";

interface AddStoreAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stores: { id: string; name: string; city: string; province: string }[];
  formData: CreateStoreAdminData;
  setFormData: (data: CreateStoreAdminData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function AddStoreAdminDialog({
  open,
  onOpenChange,
  stores,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
}: AddStoreAdminDialogProps) {
  const [show, setShow] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2 bg-green-700 hover:bg-black">
          <Plus className="h-4 w-4" />
          <span>Add Store Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Store Admin</DialogTitle>
            <DialogDescription>
              Create a new store administrator account.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter store admin name"
                required
                className="border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                required
                className="border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Password
              </Label>
              {/* relative wrapper */}
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter password"
                  required
                  className="border-black bg-white pr-10 font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700"
                />
                <button
                  tabIndex={-1}
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow(!show)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm font-extrabold text-green-700">
                Assign Store
              </Label>
              <Select
                value={formData.storeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, storeId: value })
                }
              >
                <SelectTrigger className="w-sm border-black bg-white font-semibold tracking-widest shadow-sm focus:!ring-2 focus:!ring-green-700">
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Add Store Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
