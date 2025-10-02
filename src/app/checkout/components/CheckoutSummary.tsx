"use client";
import { baseError } from "@/components/userAuth/typesAndInterfaces";
import {
  useCreateTransactionMutation,
  useShippingPriceQuery,
} from "@/hooks/checkout/getCheckoutData";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { CheckoutSummaryProps } from "@/types/checkout/checkoutTypes";
import formatCurrency from "@/utils/FormatCurrency";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

function CheckoutSummary({
  userAddress,
  productVoucher,
  deliveryVoucher,
  product,
}: CheckoutSummaryProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<
    "manual_transfer" | "midtrans"
  >("manual_transfer");

  const subTotal = product.reduce(
    (total, item) => total + item.activePrice * item.quantity,
    0,
  );
  
  const { targetStore } = useUserAuthStore();
  const storeId = targetStore?.id;

  const { data: shippingprice } = useShippingPriceQuery(
    userAddress?.id ?? null,
    storeId ?? null,
  );

  let productDiscount = 0;
  let deliveryDiscount = 0;

  let grandTotal = subTotal + shippingprice!;
  if (productVoucher) {
    grandTotal -= productVoucher.discount;
    productDiscount = productVoucher.discount;
  }
  if (deliveryVoucher) {
    grandTotal -= deliveryVoucher.discount;
    deliveryDiscount = deliveryVoucher.discount;
  }

  // Hook mutation
  const { mutateAsync, isPending } = useCreateTransactionMutation();
  
  // Fungsi untuk buat transaksi
  const createTransaction = useCallback(async () => {
    if (!targetStore?.id) {
      toast.error("Store is not available.");
      return;
    }
    try {
      const input = {
        userAddressId: userAddress?.id ?? "",
        storeId: targetStore!.id,
        shippingPrice: shippingprice ?? 0,
        paymentMethod,
        voucherProductCode: productVoucher?.code ?? null,
        voucherDeliveryCode: deliveryVoucher?.code ?? null,
      };

      const response = await mutateAsync(input);

      const transactionId = response.data.transaction.id;

      if (transactionId) {
        router.push(`/transaction/${transactionId}`);
      }
    } catch (error: unknown) {
      const customError = error as baseError;

      if (customError?.response?.data?.message) {
        toast.error(customError.response.data.message);
        return;
      }
    }
  }, [
    mutateAsync,
    paymentMethod,
    router,
    userAddress?.id,
    targetStore,
    shippingprice,
    productVoucher,
    deliveryVoucher,
  ]);

  return (
    <div className="mt-2 w-full gap-y-10 md:flex-row md:gap-x-10 md:[&>*+*]:ml-0">
      <h2 className="mb-5 text-xl font-bold">Checkout Summary</h2>
      {/* Subtotal */}
      <div className="flex justify-between border-b-2 pb-2">
        <div className="text-primary">Subtotal:</div>
        <div className="text-primary font-medium">
          {formatCurrency(subTotal)}
        </div>
      </div>

      {/* Product Discount */}
      {productDiscount > 0 && (
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary">Discount:</div>
          <div className="font-medium text-red-500">
            - {formatCurrency(productDiscount)}
          </div>
        </div>
      )}

      {/* Shipping Price */}
      <div className="mt-4 flex justify-between border-b-2 pb-2">
        <div className="text-primary">Shipping Price:</div>
        <div className="text-primary font-medium">
          {formatCurrency(shippingprice!)}
        </div>
      </div>

      {/* Shipping Discount */}
      {deliveryDiscount > 0 && (
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary">Shipping Discount:</div>
          <div className="font-medium text-red-500">
            - {formatCurrency(deliveryDiscount)}
          </div>
        </div>
      )}

      {/* Grand Total */}
      <div className="mt-4 flex justify-between border-b-2 pb-2">
        <div className="text-primary">Grand Total:</div>
        <div className="text-primary font-medium">
          {formatCurrency(grandTotal)}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-4 border-t-2 pt-2">
        <div className="text-primary mb-2 font-semibold">Payment Method:</div>
        <div className="space-y-2">
          <label
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${paymentMethod === "manual_transfer" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="manual_transfer"
              checked={paymentMethod === "manual_transfer"}
              onChange={(e) =>
                setPaymentMethod(e.target.value as typeof paymentMethod)
              }
              className="radio radio-primary"
            />
            <span className="ml-3 text-sm font-medium">Manual Transfer</span>
          </label>

          <label
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${paymentMethod === "midtrans" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="midtrans"
              checked={paymentMethod === "midtrans"}
              onChange={(e) =>
                setPaymentMethod(e.target.value as typeof paymentMethod)
              }
              className="radio radio-primary"
            />
            <span className="ml-3 text-sm font-medium">
              Automatic (Midtrans)
            </span>
          </label>
        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        className="mt-7 w-full cursor-pointer rounded-md bg-[#00a63e] p-2 font-medium text-white"
        onClick={createTransaction}
      >
        {isPending ? "Processing..." : "Create Transaction"}
      </button>
    </div>
  );
}

export default CheckoutSummary;
