import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCanceling: boolean;
};

export function CancelConfirmModal({ isOpen, onClose, onConfirm, isCanceling }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-white">Confirm Cancel Transaction</h3>
        <p className="py-2 text-sm text-white">Are you sure you want to cancel this transaction?</p>
        <div className="modal-action">
          <button onClick={onClose} className="btn" disabled={isCanceling}>No, keep it</button>
          <button onClick={onConfirm} className={`btn btn-error ${isCanceling ? "loading" : ""}`} disabled={isCanceling}>
            {isCanceling ? "Cancelling..." : "Yes, cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}