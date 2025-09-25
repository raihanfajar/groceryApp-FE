"use client";

import React, { useState } from "react";
import { Transaction } from "@/types/transaction/transactionTypes";
import formatCurrency from "@/utils/FormatCurrency";
import { toast } from "react-toastify";
import { useUploadProofOfPayment } from "@/hooks/transaction/useTransaction";
import { createPaymentActionHandler } from "../features/PaymentActionHandler";

function TransactionSummary({ transaction }: { transaction: Transaction }) {
  const { mutate, isPending } = useUploadProofOfPayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openUploadModal = () => setIsModalOpen(true);
  const closeUploadModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }
    mutate(
      { transactionId: transaction.id, file: selectedFile },
      {
        onSuccess: () => {
          closeUploadModal();
        },
      },
    );
  };

  const handlePayment = createPaymentActionHandler({
    transaction,
    openUploadModal,
  });

  return (
    <>
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
          <div>
            <em className="italic">Status:</em>{" "}
            <span>{transaction.status}</span>
          </div>
          <div>
            <em className="italic">Payment Method:</em>{" "}
            <span>{transaction.paymentMethod ?? "—"}</span>
          </div>
          {transaction.paidAt && (
            <div>
              <em className="italic">Paid At:</em>{" "}
              <span>{new Date(transaction.paidAt).toLocaleString()}</span>
            </div>
          )}
          {transaction.status === "waiting_payment" && transaction.expiryAt && (
            <div>
              <em className="italic">Expires At:</em>{" "}
              <span>{new Date(transaction.expiryAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex gap-3">
          {(transaction.paymentMethod === "manual_transfer" ||
            transaction.paymentMethod === "midtrans") && (
            <button onClick={handlePayment} className="btn btn-primary btn-sm w-full h-10 text-base">
              {transaction.paymentMethod === "manual_transfer"
                ? "Upload Payment Proof"
                : "Pay with Midtrans"}
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <input
        type="checkbox"
        id="upload-proof-modal"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen((s) => !s)}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-white">Upload Payment Proof</h3>
          <p className="py-2 text-sm text-white">
            Please upload your payment receipt or proof of transfer.
          </p>

          <div className="form-control">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full text-white"
            />
          </div>

          <div className="modal-action">
            <button onClick={closeUploadModal} className="btn">
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              className={`btn btn-primary ${isPending ? "loading" : ""}`}
              disabled={!selectedFile || isPending}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionSummary;
