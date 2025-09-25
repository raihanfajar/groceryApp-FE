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
    const method = transaction?.paymentMethod ?? null;

    if (method === "manual_transfer") {
      openUploadModal();
      return;
    }

    if (method === "midtrans") {
      const url = transaction?.snapRedirectUrl ?? null;

      if (!url) {
        toast.error("Midtrans payment link not available.");
        return;
      }

      if (typeof openMidtransPopup === "function") {
        openMidtransPopup(url);
        return;
      }

      // Default popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        url,
        "midtrans_payment_window",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
      );
      return;
    }
    toast.error("Unsupported payment method.");
  };
}
