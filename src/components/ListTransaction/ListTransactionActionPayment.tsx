"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCancelTransaction,
  useUploadProofOfPayment,
} from "@/hooks/transaction/useTransaction";
import { TransactionFinal } from "@/types/transaction/FinalTypes";
import { useRouter } from "next/navigation";

type Props = {
  transaction: TransactionFinal;
  openMidtransPopup?: (url: string) => void;
};

export default function PaymentActions({
  transaction,
  openMidtransPopup,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter(); // Tambahkan router untuk redirect
  const { mutate: uploadMutate, isPending: isUploading } =
    useUploadProofOfPayment();
  const { mutate: cancelTransaction, isPending: isCanceling } =
    useCancelTransaction(transaction?.id);

  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePaymentClick = () => {
    if (transaction.paymentMethod === "manual_transfer") {
      setUploadModalOpen(true);
    } else if (openMidtransPopup && transaction.snapRedirectUrl) {
      openMidtransPopup(transaction.snapRedirectUrl);
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile || !transaction?.id) {
      return toast.error("Please choose a file first.");
    }
    uploadMutate(
      { transactionId: transaction.id, file: selectedFile },
      {
        onSuccess: () => {
          setSelectedFile(null);
          setUploadModalOpen(false);
          toast.success("Upload successful! Redirecting...");
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
      onSuccess: () => {
        setCancelModalOpen(false);
        toast.info("Transaction cancelled. Redirecting...");
        router.push("/");
      },
    });
  };

  if (transaction?.status !== "waiting_payment") return null;

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-3">
        <div className="w-full">
          <button
            onClick={handlePaymentClick}
            className="btn btn-primary h-10 w-full text-sm"
          >
            {transaction.paymentMethod === "manual_transfer"
              ? "Upload Payment Proof"
              : "Pay with Midtrans"}
          </button>
        </div>
        <div className="w-full">
          <button
            onClick={() => setCancelModalOpen(true)}
            className="btn btn-outline btn-sm text-error h-10 w-full text-sm"
            disabled={isCanceling}
          >
            {isCanceling ? "Cancelling..." : "Cancel Transaction"}
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button
              type="button"
              onClick={() => {
                setUploadModalOpen(false);
                setSelectedFile(null);
              }}
              className="btn btn-sm btn-circle btn-ghost absolute top-3 right-3 text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white">
              Upload Payment Proof
            </h3>
            <p className="py-2 text-sm text-white">
              Please upload your payment receipt or proof of transfer.
            </p>
            <div className="form-control">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full text-white"
              />
            </div>
            {selectedFile && (
              <div className="bg-base-200 mt-3 rounded-lg border p-3 text-sm">
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                  {selectedFile.type}
                </div>
              </div>
            )}
            <div className="modal-action">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFile(null);
                }}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className={`btn btn-primary ${isUploading ? "loading" : ""}`}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-white">
              Confirm Cancel Transaction
            </h3>
            <p className="py-2 text-sm text-white">
              Are you sure you want to cancel this transaction? This action
              cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="btn border-2 border-black bg-white text-black"
                disabled={isCanceling}
              >
                No, keep it
              </button>
              <button
                onClick={handleConfirmCancel}
                className={`btn btn-error text-black ${
                  isCanceling ? "loading" : ""
                }`}
                disabled={isCanceling}
              >
                {isCanceling ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
