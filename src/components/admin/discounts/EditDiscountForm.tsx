"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Discount, DiscountValueType } from "@/types/discount";
import { useUpdateDiscount } from "@/hooks/admin/useUpdateDiscount";
import { useEditDiscountForm } from "@/hooks/admin/useEditDiscountForm";
import EditBasicInfoFields from "./edit/EditBasicInfoFields";
import EditConditionalFields from "./edit/EditConditionalFields";
import EditDateAndLimitFields from "./edit/EditDateAndLimitFields";

interface EditDiscountFormProps {
  discount: Discount | null;
  onClose: () => void;
}

export default function EditDiscountForm({
  discount,
  onClose,
}: EditDiscountFormProps) {
  const { admin } = useAdminAuthStore();

  const { formData, updateFormData } = useEditDiscountForm(discount);
  const updateDiscountMutation = useUpdateDiscount(
    discount?.id || "",
    admin?.id,
    admin?.store?.id,
    admin?.accessToken,
    onClose,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDiscountMutation.mutate(formData);
  };

  if (!discount) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <EditBasicInfoFields
        name={formData.name || ""}
        description={formData.description || ""}
        discountType={discount.type}
        valueType={formData.valueType || DiscountValueType.PERCENTAGE}
        value={formData.value || 0}
        onNameChange={(value) => updateFormData({ name: value })}
        onDescriptionChange={(value) => updateFormData({ description: value })}
        onValueTypeChange={(value) => updateFormData({ valueType: value })}
        onValueChange={(value) => updateFormData({ value })}
      />

      <EditConditionalFields
        valueType={formData.valueType || DiscountValueType.PERCENTAGE}
        maxDiscountAmount={formData.maxDiscountAmount}
        minTransactionValue={discount.minTransactionValue}
        onMaxDiscountAmountChange={(value) =>
          updateFormData({ maxDiscountAmount: value })
        }
        onMinTransactionValueChange={(value) =>
          updateFormData({ minTransactionValue: value })
        }
      />

      <EditDateAndLimitFields
        startDate={formData.startDate || ""}
        endDate={formData.endDate || ""}
        totalUsageLimit={formData.totalUsageLimit}
        maxUsagePerCustomer={formData.maxUsagePerCustomer}
        onStartDateChange={(value) => updateFormData({ startDate: value })}
        onEndDateChange={(value) => updateFormData({ endDate: value })}
        onTotalUsageLimitChange={(value) =>
          updateFormData({ totalUsageLimit: value })
        }
        onMaxUsagePerCustomerChange={(value) =>
          updateFormData({ maxUsagePerCustomer: value })
        }
      />

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
