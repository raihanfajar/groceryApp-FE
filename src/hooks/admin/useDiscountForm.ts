import { useState } from "react";
import {
  CreateDiscountData,
  DiscountType,
  DiscountValueType,
} from "@/types/discount";

export function useDiscountForm() {
  const [formData, setFormData] = useState<CreateDiscountData>({
    name: "",
    description: "",
    type: DiscountType.MANUAL,
    valueType: DiscountValueType.PERCENTAGE,
    value: 0,
    startDate: "",
    endDate: "",
    productIds: [],
  });

  const updateFormData = (updates: Partial<CreateDiscountData>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    const currentIds = formData.productIds || [];
    updateFormData({
      productIds: checked
        ? [...currentIds, productId]
        : currentIds.filter((id) => id !== productId),
    });
  };

  const handleSelectAll = (
    checked: boolean,
    products: Array<{ id: string }>,
  ) => {
    updateFormData({
      productIds: checked ? products.map((p) => p.id) : [],
    });
  };

  return {
    formData,
    updateFormData,
    handleProductToggle,
    handleSelectAll,
  };
}
