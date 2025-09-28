"use client";

import React from "react";
import { Transaction } from "@/types/transaction/transactionTypes";
import formatCurrency from "@/utils/FormatCurrency";
import PaymentActions from "./PaymentAction";
import { useCountdown } from "@/utils/useCountdown";

function TransactionSummary({ transaction }: { transaction: Transaction }) {
  const countdown = useCountdown(transaction.expiryAt ?? null);

  return (
    <>
      <div className="w-full max-w-md rounded-lg border border-black bg-[#ffffffdb] p-4 shadow-md md:ml-auto">
        <h2 className="mb-5 text-lg font-semibold">Transaction Summary</h2>

        {/* Subtotal */}
        <div className="flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs md:text-sm">Subtotal:</div>
          <div className="text-primary text-xs font-medium md:text-sm">
            {formatCurrency(transaction.totalProductPrice)}
          </div>
        </div>

        {/* Product Discount */}
        {transaction.discountedProductPrice > 0 && (
          <div className="mt-4 flex justify-between border-b-2 pb-2">
            <div className="text-primary text-xs md:text-sm">
              Product Discount:
            </div>
            <div className="text-xs font-medium text-green-500 md:text-sm">
              - {formatCurrency(transaction.discountedProductPrice)}
            </div>
          </div>
        )}

        {/* Shipping Price */}
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs md:text-sm">Shipping Price:</div>
          <div className="text-primary text-xs font-medium md:text-sm">
            {formatCurrency(transaction.shippingPrice)}
          </div>
        </div>

        {/* Shipping Discount */}
        {(transaction.discountedShipping ?? 0) > 0 && (
          <div className="mt-4 flex justify-between border-b-2 pb-2">
            <div className="text-primary text-xs md:text-sm">
              Shipping Discount:
            </div>
            <div className="text-xs font-medium text-green-500 md:text-sm">
              - {formatCurrency(transaction.discountedShipping ?? 0)}
            </div>
          </div>
        )}

        {/* Grand Total */}
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs font-semibold md:text-sm">
            Grand Total:
          </div>
          <div className="text-primary text-xs font-semibold md:text-sm">
            {formatCurrency(transaction.totalPrice)}
          </div>
        </div>

        {/* Expiring Time */}
        {transaction.status === "waiting_payment" && transaction.expiryAt && (
          <div className="mt-4 flex items-center justify-between">
            <em className="text-primary text-xs font-semibold md:text-sm">
              Time Left:
            </em>
            <span className="font-semibold text-red-600">{countdown}</span>
          </div>
        )}

        <PaymentActions
          transaction={transaction}
          openMidtransPopup={() => {}}
        />
      </div>
    </>
  );
}

export default TransactionSummary;
