"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { getProductVoucher } from "@/hooks/voucher/getVoucher";

function CartSumary() {
  const [voucherCode, setVoucherCode] = useState("");

  const debouncedCode = useDebounce(voucherCode, 500);
  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ["voucher", voucherCode],
    queryFn: () => getProductVoucher(debouncedCode),
    enabled: !!debouncedCode,
  });

  const showDiscount = !!voucherCode && !!data; // guard ketat
  const appliedDiscount = showDiscount ? data.discount : 0;

  return (
    <div className="mt-14 w-full gap-y-10 md:mt-20 md:flex md:flex-row md:justify-between md:gap-x-10 md:[&>*+*]:ml-0">
      {/* Voucher */}
      <div className="md:max-w-l md:ml-3">
        <div className="text-primary mb-2 font-medium">Voucher Code : </div>
        <input
          type="text"
          value={voucherCode}
          className="w-[100%] border-b-2 px-2 md:max-w-lg"
          onChange={(e) => setVoucherCode(e.target.value)}
          placeholder="Enter Voucher Code here..."
        />
        {voucherCode ? (
          <>
            {isSuccess && data && (
              <div className="mt-2 flex items-center gap-2">
                <div className="text-primary font-medium">Discount:</div>
                <div className="text-primary font-medium">
                  Rp. {appliedDiscount}
                </div>
              </div>
            )}

            {!isFetching && (isError || !data) && (
              <div className="mt-2 flex items-center text-red-500">
                Voucher not found
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Total */}
      <div className="mt-12 w-full md:mt-0 md:mr-3 md:w-sm lg:mr-0">
        <div className="flex justify-between border-b-2">
          <div className="text-primary">Subtotal: </div>
          <div className="text-primary font-medium">Rp. 0</div>
        </div>
        {showDiscount && (
          <div className="mt-7 flex justify-between border-b-2">
            <div className="text-primary">Discount: </div>
            <div className="text-primary font-medium">Rp. {data.discount}</div>
          </div>
        )}
        <div className="mt-7 flex justify-between border-b-2">
          <div className="text-primary">Grand Total: </div>
          <div className="text-primary font-medium">Rp. 0</div>
        </div>
        <button className="mt-7 w-full rounded-md bg-[#00a63e] p-2 font-medium text-white">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartSumary;
