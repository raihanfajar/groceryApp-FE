import React, { useState } from "react";
import ProductTransactionList from "./ProductTransactionList";
import { useCountdown } from "@/utils/useCountdown";
import ListTransactionPaymentActions from "./ListTransactionActionPayment";
import CompleteTransactionAction from "./CompleteTransactionAction";
import formatCurrency from "@/utils/FormatCurrency";
import { useRouter } from "next/navigation";
import { TransactionFinal } from "@/types/transaction/FinalTypes";

type UserTransactionListProps = {
  transaction: TransactionFinal;
};

function UserTransactionList({ transaction }: UserTransactionListProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const products = transaction.products ?? [];
  const visibleProducts = expanded ? products : products.slice(0, 1);

  const expiryArg =
    transaction.status === "waiting_payment" && transaction.expiryAt
      ? transaction.expiryAt
      : null;

  const countdown = useCountdown(expiryArg);
  const completed = transaction.status === "shipped" ? true : null;

  return (
    <>
      <div className="mt-2 h-auto w-full rounded-md border border-gray-600">
        <div className="p-4">
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
          {/* Timer Countdown */}
          {countdown && (
            <div className="mt-3 w-full flex-row items-center justify-end gap-3 space-y-3 rounded-md bg-[#f5f5f5] p-3 font-semibold md:flex md:space-y-0">
              <p className="text-sm text-gray-600">
                Payment expires in : {countdown}
              </p>
              <ListTransactionPaymentActions
                transaction={transaction}
                openMidtransPopup={() => {}}
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
