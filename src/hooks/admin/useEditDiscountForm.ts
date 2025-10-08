import { useState, useEffect } from "react";
import { Discount, UpdateDiscountData } from "@/types/discount";

function formatDateForInput(dateString: string): string {
  const parts = dateString.split("T");
  const datePart = parts[0];
  const timePart = parts[1]?.split(".")[0] || "00:00:00";
  return `${datePart}T${timePart}`;
}

export function useEditDiscountForm(discount: Discount | null) {
  const [formData, setFormData] = useState<UpdateDiscountData>({});

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
        startDate: formatDateForInput(discount.startDate),
        endDate: formatDateForInput(discount.endDate),
        isActive: discount.isActive,
      });
    }
  }, [discount]);

  const updateFormData = (updates: Partial<UpdateDiscountData>) => {
    setFormData({ ...formData, ...updates });
  };

  return {
    formData,
    updateFormData,
  };
}
