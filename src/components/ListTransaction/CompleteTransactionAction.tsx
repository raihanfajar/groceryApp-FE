"use client";

import React from "react";
import { useCompleteTransaction } from "@/hooks/transaction/useTransaction";
import { TransactionFinal } from "@/types/transaction/FinalTypes";

type Props = {
  transaction: TransactionFinal;
};

export default function CompleteTransactionAction({ transaction }: Props) {
  console.log("CompleteTransactionAction transaction:", transaction.id);

  const completeMutation = useCompleteTransaction(transaction?.id);

  if (transaction?.status !== "shipped") return null;

  return (
    <div className="mt-5 flex">
      <button
        onClick={() => completeMutation.mutate()}
        className="btn btn-success h-10 w-full text-sm font-semibold"
        disabled={completeMutation.isPending}
      >
        {completeMutation.isPending ? "Completing..." : "Complete Transaction"}
      </button>
    </div>
  );
}
