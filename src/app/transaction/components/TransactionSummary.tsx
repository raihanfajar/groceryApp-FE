"use client";

import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Transaction } from "@/types/transaction/transactionTypes";
import formatCurrency from "@/utils/FormatCurrency";
import { useCountdown } from "@/utils/useCountdown";
import PaymentActions from "./PaymentAction";

function TransactionSummary({ transaction }: { transaction: Transaction }) {
  const countdown = useCountdown(transaction.expiryAt ?? null);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const snapScriptId = "midtrans-snap-script";
    const scriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!scriptUrl || !clientKey) {
      console.error("Midtrans environment variables are not set.");
      return;
    }

    if (document.getElementById(snapScriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = snapScriptId;
    script.src = scriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(snapScriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleOpenMidtrans = () => {
    if (!window.snap) {
      toast.error("Payment gateway is not ready. Please wait a moment.");
      return;
    }

    if (!transaction.snapToken) {
      toast.error("Payment token is not available. Please try again later.");
      return;
    }

    window.snap.pay(transaction.snapToken, {
      onSuccess: () => {
        toast.success("Payment successful! Refreshing transaction status...");
        queryClient.invalidateQueries({
          queryKey: ["transactionDetails", transaction.id],
        });
        router.refresh();
      },
      onPending: () => {
        toast.info("Waiting for your payment. We will update the status soon.");
        queryClient.invalidateQueries({
          queryKey: ["transactionDetails", transaction.id],
        });
        router.refresh();
      },
      onError: () => {
        toast.error("Payment failed. Please try again or use another method.");
      },
      onClose: () => {
        toast.warn("You closed the payment popup without finishing.");
      },
    });
  };

  return (
    <>
      <div className="w-full max-w-md rounded-lg border border-black bg-[#ffffffdb] p-4 shadow-md md:ml-auto">
        <h2 className="mb-5 text-lg font-semibold">Transaction Summary</h2>

        <div className="flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs md:text-sm">Subtotal:</div>
          <div className="text-primary text-xs font-medium md:text-sm">
            {formatCurrency(transaction.totalProductPrice)}
          </div>
        </div>
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
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs md:text-sm">Shipping Price:</div>
          <div className="text-primary text-xs font-medium md:text-sm">
            {formatCurrency(transaction.shippingPrice)}
          </div>
        </div>
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
        <div className="mt-4 flex justify-between border-b-2 pb-2">
          <div className="text-primary text-xs font-semibold md:text-sm">
            Grand Total:
          </div>
          <div className="text-primary text-xs font-semibold md:text-sm">
            {formatCurrency(transaction.totalPrice)}
          </div>
        </div>
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
          openMidtransPopup={handleOpenMidtrans}
        />
      </div>
    </>
  );
}

export default TransactionSummary;
