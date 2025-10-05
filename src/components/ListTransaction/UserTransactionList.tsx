"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ProductTransactionList from "./ProductTransactionList";
import { useCountdown } from "@/utils/useCountdown";
import CompleteTransactionAction from "./CompleteTransactionAction";
import formatCurrency from "@/utils/FormatCurrency";
import { TransactionFinal } from "@/types/transaction/FinalTypes";
import { formatDateToIndonesian } from "@/utils/FormatDate";
import PaymentActions from "./ListTransactionActionPayment";

type UserTransactionListProps = {
  transaction: TransactionFinal;
};

function UserTransactionList({ transaction }: UserTransactionListProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const products = transaction.products ?? [];
  const visibleProducts = expanded ? products : products.slice(0, 1);

  const expiryArg =
    transaction.status === "waiting_payment" && transaction.expiryAt
      ? transaction.expiryAt
      : null;

  const countdown = useCountdown(expiryArg);
  const completed = transaction.status === "shipped" ? true : null;

  useEffect(() => {
    const snapScriptId = "midtrans-snap-script";
    const scriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!scriptUrl || !clientKey) {
      console.error("Midtrans environment variables are not set.");
      return;
    }
    if (document.getElementById(snapScriptId)) return;

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
      return toast.error("Payment gateway is not ready.");
    }
    if (!transaction.snapToken) {
      return toast.error("Payment token is not available.");
    }

    window.snap.pay(transaction.snapToken, {
      onSuccess: () => {
        toast.success("Payment successful! Refreshing status...");
        queryClient.invalidateQueries({ queryKey: ["userTransactions"] });
        router.refresh();
      },
      onPending: () => {
        toast.info("Waiting for payment...");
        router.refresh();
      },
      onError: () => {
        toast.error("Payment failed. Please try again.");
      },
      onClose: () => {},
    });
  };

  return (
    <>
      <div className="mt-2 h-auto w-full rounded-md border border-gray-600">
        <div className="p-4">
          <div className="border-b pb-3 text-sm">
            Transaction Id : {transaction.id}
            <br />
            {formatDateToIndonesian(transaction.createdAt)}
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/transaction/${transaction.id}`)}
          >
            {visibleProducts.map((item) => (
              <ProductTransactionList key={item.id} item={item} />
            ))}
          </div>
          {products.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
              className="mt-3 flex w-full cursor-pointer items-center justify-center text-sm text-gray-600 hover:underline"
            >
              {expanded
                ? "See less"
                : `See more (${products.length - 1} more item${
                    products.length - 1 > 1 ? "s" : ""
                  })`}
            </button>
          )}
          <div className="mt-3 ml-auto flex items-center justify-end text-base font-semibold">
            <p>Total : {formatCurrency(transaction.totalPrice)}</p>
          </div>
          {/* Timer Countdown & Actions */}
          {countdown && (
            <div className="mt-3 w-full flex-row items-center justify-end gap-3 space-y-3 rounded-md bg-[#f5f5f5] p-3 font-semibold md:flex md:space-y-0">
              <p className="text-sm text-gray-600">
                Payment expires in : {countdown}
              </p>
              {/* Menggunakan nama komponen dan prop yang benar */}
              <PaymentActions
                transaction={transaction}
                openMidtransPopup={handleOpenMidtrans}
              />
            </div>
          )}
          {completed && (
            <div className="w-full lg:ml-auto lg:w-3/12">
              <CompleteTransactionAction transaction={transaction} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserTransactionList;
