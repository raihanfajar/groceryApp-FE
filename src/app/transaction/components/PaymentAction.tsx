"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/transaction/transactionTypes";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useCancelTransaction,
  useUploadProofOfPayment,
} from "@/hooks/transaction/useTransaction";
import { UploadProofModal } from "./UploadProofModal";
import { CancelConfirmModal } from "./CancelConfirmModal";

type Props = {
  transaction: Transaction;
  openMidtransPopup?: (url: string) => void;
};

export default function PaymentActions({
  transaction,
  openMidtransPopup,
}: Props) {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: uploadMutate, isPending: isUploading } =
    useUploadProofOfPayment();
  const { mutate: cancelTransaction, isPending: isCanceling } =
    useCancelTransaction(transaction?.id);

  const handleUploadSubmit = (file: File) => {
    if (!transaction?.id) return toast.error("Transaction ID missing");

    uploadMutate(
      { transactionId: transaction.id, file },
      {
        onSuccess: () => {
          setUploadModalOpen(false);
          toast.success("Upload successful!");
          queryClient.invalidateQueries({
            queryKey: ["transactionDetails", transaction.id],
          });
          router.push("/");
        },
      },
    );
  };

  const handleConfirmCancel = () => {
    if (!transaction?.id) return;
    cancelTransaction(undefined, {
      onSuccess: () => setCancelModalOpen(false),
    });
  };

  if (transaction?.status !== "waiting_payment") return null;

  const paymentButtonText =
    transaction.paymentMethod === "manual_transfer"
      ? "Upload Payment Proof"
      : "Pay with Midtrans";

  const handlePaymentClick = () => {
    if (transaction.paymentMethod === "manual_transfer") {
      setUploadModalOpen(true);
    } else if (openMidtransPopup && transaction.snapRedirectUrl) {
      openMidtransPopup(transaction.snapRedirectUrl);
    }
  };

  return (
    <>
      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={handlePaymentClick}
          className="btn btn-primary h-10 w-full text-sm"
        >
          {paymentButtonText}
        </button>
        <button
          onClick={() => setCancelModalOpen(true)}
          className="btn btn-outline btn-sm text-error h-10 w-full text-sm"
          disabled={isCanceling}
        >
          {isCanceling ? "Cancelling..." : "Cancel Transaction"}
        </button>
      </div>

      <UploadProofModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleUploadSubmit}
        isUploading={isUploading}
      />

      <CancelConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isCanceling={isCanceling}
      />
    </>
  );
}
