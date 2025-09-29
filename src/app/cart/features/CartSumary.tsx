"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { getProductVoucher } from "@/hooks/voucher/getVoucher";
import { useUserCart } from "@/hooks/cart/getUserCart";
import formatCurrency from "@/utils/FormatCurrency";
import { useRouter } from "next/navigation";

function CartSummary() {
  const [voucherCode, setVoucherCode] = useState("");
  const debouncedCode = useDebounce(voucherCode, 500);
  const router = useRouter();

  const {
    data: voucherData,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["voucher", debouncedCode],
    queryFn: () => getProductVoucher(debouncedCode),
    enabled: !!debouncedCode,
  });

  const { data: cart } = useUserCart();

  const validItems =
    cart?.items?.filter(
      (item) =>
        item.availability?.status === "AVAILABLE" &&
        item.availability?.currentStock > 0,
    ) ?? [];

  const subtotal = validItems.reduce(
    (total, item) => total + item.activePrice * item.quantity,
    0,
  );

  let appliedDiscount = 0;
  if (voucherCode && voucherData && isSuccess && validItems.length > 0) {
    appliedDiscount = voucherData.discount || 0;
  }

  const grandTotal = Math.max(0, subtotal - appliedDiscount);

  return (
    <div className="mt-14 w-full gap-y-10 md:mt-20 md:flex md:flex-row md:justify-between md:gap-x-10 md:[&>*+*]:ml-0">
      {/* Voucher */}
      <div className="md:max-w-l md:ml-3">
        <div className="text-primary mb-2 font-medium">Voucher Code:</div>
        <input
          type="text"
          value={voucherCode}
          className="w-[100%] border-b-2 px-2 md:max-w-lg"
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Enter Voucher Code here..."
        />
        {voucherCode ? (
          <>
            {isSuccess && voucherData && validItems.length > 0 && (
              <div className="mt-2 text-green-600">
                Voucher successfully applied!
              </div>
            )}
            {!isFetching && (isError || !voucherData) && (
              <div className="mt-2 text-red-500">Voucher not found</div>
            )}
          </>
        ) : null}
      </div>

      {/* Total */}
      <div className="mt-12 w-full md:mt-0 md:mr-3 md:w-sm lg:mr-0">
        <div className="flex justify-between border-b-2 pb-2">
          <div className="text-primary">Subtotal:</div>
          <div className="text-primary font-medium">
            {formatCurrency(subtotal)}
          </div>
        </div>

        {appliedDiscount > 0 && (
          <div className="mt-4 flex justify-between border-b-2 pb-2">
            <div className="text-primary">Discount:</div>
            <div className="text-primary font-medium">
              - {formatCurrency(appliedDiscount)}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <div className="text-primary text-lg font-bold">Grand Total:</div>
          <div className="text-primary text-lg font-bold">
            {formatCurrency(grandTotal)}
          </div>
        </div>
        <button
          type="button"
          className="mt-7 w-full cursor-pointer rounded-md bg-[#00a63e] p-2 font-medium text-white disabled:opacity-50"
          onClick={() => router.push("/checkout")}
          disabled={validItems.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
