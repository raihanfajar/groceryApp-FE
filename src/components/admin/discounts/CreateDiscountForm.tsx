"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { useProducts, useStores } from "@/hooks/admin/useDiscountFormData";
import { useCreateDiscount } from "@/hooks/admin/useCreateDiscount";
import { useDiscountForm } from "@/hooks/admin/useDiscountForm";
import BasicInfoFields from "./form/BasicInfoFields";
import ConditionalFields from "./form/ConditionalFields";
import StoreSelection, { DateAndLimitFields } from "./form/StoreAndDateFields";
import ProductSelection from "./form/ProductSelection";

interface CreateDiscountFormProps {
  onClose: () => void;
}

export default function CreateDiscountForm({
  onClose,
}: CreateDiscountFormProps) {
  const { admin } = useAdminAuthStore();

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts(admin?.accessToken);
  const { data: stores } = useStores(admin?.accessToken, admin?.isSuper);

  const { formData, updateFormData, handleProductToggle, handleSelectAll } =
    useDiscountForm();
  const createDiscountMutation = useCreateDiscount(
    admin?.id,
    admin?.store?.id,
    admin?.accessToken,
    onClose,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      admin?.isSuper &&
      formData.storeId === "" &&
      formData.storeId !== undefined
    ) {
      toast.error("Please select a target store or choose Global option");
      return;
    }
    createDiscountMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoFields
        name={formData.name}
        description={formData.description || ""}
        type={formData.type}
        valueType={formData.valueType}
        value={formData.value}
        maxDiscountAmount={formData.maxDiscountAmount}
        onNameChange={(value) => updateFormData({ name: value })}
        onDescriptionChange={(value) => updateFormData({ description: value })}
        onTypeChange={(value) => updateFormData({ type: value })}
        onValueTypeChange={(value) => updateFormData({ valueType: value })}
        onValueChange={(value) => updateFormData({ value })}
        onMaxDiscountAmountChange={(value) =>
          updateFormData({ maxDiscountAmount: value })
        }
      />

      <StoreSelection
        isSuper={!!admin?.isSuper}
        stores={stores}
        selectedStoreId={formData.storeId}
        onStoreChange={(value) => updateFormData({ storeId: value })}
      />

      <ConditionalFields
        type={formData.type}
        minTransactionValue={formData.minTransactionValue}
        buyQuantity={formData.buyQuantity}
        getQuantity={formData.getQuantity}
        maxBogoSets={formData.maxBogoSets}
        applyToSameProduct={formData.applyToSameProduct}
        onMinTransactionValueChange={(value) =>
          updateFormData({ minTransactionValue: value })
        }
        onBuyQuantityChange={(value) => updateFormData({ buyQuantity: value })}
        onGetQuantityChange={(value) => updateFormData({ getQuantity: value })}
        onMaxBogoSetsChange={(value) => updateFormData({ maxBogoSets: value })}
        onApplyToSameProductChange={(value) =>
          updateFormData({ applyToSameProduct: value })
        }
      />

      <DateAndLimitFields
        startDate={formData.startDate}
        endDate={formData.endDate}
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

      <ProductSelection
        products={products}
        selectedProductIds={formData.productIds || []}
        isLoading={productsLoading}
        hasError={!!productsError}
        hasAuthToken={!!admin?.accessToken}
        onProductToggle={handleProductToggle}
        onSelectAll={(checked) => handleSelectAll(checked, products || [])}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            createDiscountMutation.isPending ||
            !formData.productIds ||
            formData.productIds.length === 0 ||
            (admin?.isSuper && formData.storeId === "")
          }
        >
          {createDiscountMutation.isPending ? "Creating..." : "Create Discount"}
        </Button>
      </DialogFooter>
    </form>
  );
}
