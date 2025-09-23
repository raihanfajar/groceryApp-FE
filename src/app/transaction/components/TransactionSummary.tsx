"use client";

import React from "react";
import { Transaction } from "@/types/transaction/transactionTypes";
import formatCurrency from "@/utils/FormatCurrency";

function TransactionSummary({ transaction }: { transaction: Transaction }) {
  return (
    <div className="mt-7 ml-auto w-full max-w-md rounded-lg bg-[#f5f5f5] p-4 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">Transaction Summary</h2>

      {/* Subtotal */}
      <div className="flex justify-between border-b-2 pb-2">
        <div className="text-primary">Subtotal:</div>
        <div className="text-primary font-medium">
          {formatCurrency(transaction.totalProductPrice)}
        </div>
      </div>

      {/* Product Discount */}
      {transaction.discountedProductPrice > 0 && (
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary">Product Discount:</div>
          <div className="font-medium text-red-500">
            - {formatCurrency(transaction.discountedProductPrice)}
          </div>
        </div>
      )}

      {/* Shipping Price */}
      <div className="mt-4 flex justify-between border-b-2 pb-2">
        <div className="text-primary">Shipping Price:</div>
        <div className="text-primary font-medium">
          {formatCurrency(transaction.shippingPrice)}
        </div>
      </div>

      {/* Shipping Discount */}
      {(transaction.discountedShipping ?? 0) > 0 && (
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary">Shipping Discount:</div>
          <div className="font-medium text-red-500">
            - {formatCurrency(transaction.discountedShipping ?? 0)}
          </div>
        </div>
      )}

      {/* Grand Total */}
      <div className="mt-4 flex justify-between border-b-2 pb-2">
        <div className="text-primary font-semibold">Grand Total:</div>
        <div className="text-primary font-semibold">
          {formatCurrency(transaction.totalPrice)}
        </div>
      </div>

      {/* Status & Payment Info */}
      <div className="mt-4 text-sm text-gray-600">
        <div>Status: {transaction.status}</div>
        <div>Payment Method: {transaction.paymentMethod ?? "—"}</div>
        {transaction.paidAt && (
          <div>Paid At: {new Date(transaction.paidAt).toLocaleString()}</div>
        )}
        {transaction.status === "waiting_payment" && transaction.expiryAt && (
          <div>
            Expires At: {new Date(transaction.expiryAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionSummary;
