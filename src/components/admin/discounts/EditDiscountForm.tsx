"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";
import {
  Discount,
  UpdateDiscountData,
  DiscountValueType,
} from "@/types/discount";

interface EditDiscountFormProps {
  discount: Discount | null;
  onClose: () => void;
}

export default function EditDiscountForm({
  discount,
  onClose,
}: EditDiscountFormProps) {
  const [formData, setFormData] = useState<UpdateDiscountData>({});

  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (discount) {
      setFormData({
        name: discount.name,
        description: discount.description || "",
        valueType: discount.valueType,
        value: discount.value,
        maxDiscountAmount: discount.maxDiscountAmount || undefined,
        minTransactionValue: discount.minTransactionValue || undefined,
        maxUsagePerCustomer: discount.maxUsagePerCustomer || undefined,
        totalUsageLimit: discount.totalUsageLimit || undefined,
        startDate:
          discount.startDate.split("T")[0] +
            "T" +
            discount.startDate.split("T")[1]?.split(".")[0] ||
          discount.startDate,
        endDate:
          discount.endDate.split("T")[0] +
            "T" +
            discount.endDate.split("T")[1]?.split(".")[0] || discount.endDate,
        isActive: discount.isActive,
      });
    }
  }, [discount]);

  // Update discount mutation
  const updateDiscountMutation = useMutation({
    mutationFn: async (data: UpdateDiscountData) => {
      if (!discount) throw new Error("No discount to update");
      const response = await axiosInstance.put(
        `/discounts/${discount.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${admin?.accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", admin?.id, admin?.store?.id],
      });
      onClose();
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to update discount");
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDiscountMutation.mutate(formData);
  };

  if (!discount) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Discount Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Discount Type</Label>
          <Input value={discount.type} disabled className="bg-gray-100" />
          <p className="text-xs text-gray-500">
            Discount type cannot be changed
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valueType">Value Type *</Label>
          <Select
            value={formData.valueType}
            onValueChange={(value: DiscountValueType) =>
              setFormData({ ...formData, valueType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DiscountValueType.PERCENTAGE}>
                Percentage (%)
              </SelectItem>
              <SelectItem value={DiscountValueType.NOMINAL}>
                Fixed Amount (Rp)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            {formData.valueType === DiscountValueType.PERCENTAGE
              ? "Percentage"
              : "Amount"}{" "}
            *
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value || ""}
            onChange={(e) =>
              setFormData({ ...formData, value: parseInt(e.target.value) || 0 })
            }
            min="0"
            max={
              formData.valueType === DiscountValueType.PERCENTAGE
                ? "100"
                : undefined
            }
            required
          />
        </div>
      </div>

      {formData.valueType === DiscountValueType.PERCENTAGE && (
        <div className="space-y-2">
          <Label htmlFor="maxDiscountAmount">
            Maximum Discount Amount (Rp)
          </Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            value={formData.maxDiscountAmount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxDiscountAmount: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
          />
        </div>
      )}

      {discount.minTransactionValue !== null && (
        <div className="space-y-2">
          <Label htmlFor="minTransactionValue">
            Minimum Transaction Value (Rp)
          </Label>
          <Input
            id="minTransactionValue"
            type="number"
            value={formData.minTransactionValue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minTransactionValue: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate || ""}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
          <Input
            id="totalUsageLimit"
            type="number"
            value={formData.totalUsageLimit || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalUsageLimit: parseInt(e.target.value) || undefined,
              })
            }
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsagePerCustomer">Max Usage Per Customer</Label>
          <Input
            id="maxUsagePerCustomer"
            type="number"
            value={formData.maxUsagePerCustomer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxUsagePerCustomer: parseInt(e.target.value) || undefined,
              })
            }
            min="1"
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateDiscountMutation.isPending}>
          {updateDiscountMutation.isPending ? "Updating..." : "Update Discount"}
        </Button>
      </DialogFooter>
    </form>
  );
}
