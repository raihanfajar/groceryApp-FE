import { Transaction } from "@/types/transaction/transactionTypes";
import { toast } from "react-toastify";

type CreatePaymentActionHandlerArgs = {
  transaction: Transaction;
  openUploadModal: () => void;
  openMidtransPopup?: (url: string) => void;
  midtransUrl?: string | null;
};

export function createPaymentActionHandler({
  transaction,
  openUploadModal,
  openMidtransPopup,
  midtransUrl,
}: CreatePaymentActionHandlerArgs) {
  return function handlePaymentAction() {
    const method = transaction?.paymentMethod;

    if (method === "manual_transfer") {
      openUploadModal();
      return;
    }

    if (method === "midtrans") {
      const url = midtransUrl;
      if (!url) {
        toast.error("Midtrans payment link not available.");
        return;
      }

      if (typeof openMidtransPopup === "function") {
        openMidtransPopup(url);
        return;
      }

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        url,
        "midtrans_payment_window",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );

      if (popup) {
        try {
          popup.focus();
        } catch {}
      } else {
        toast.error(
          "Popup blocked. Please allow popups or open the link manually.",
        );
      }
      return;
    }

    toast.error("Unsupported payment method.");
  };
}
