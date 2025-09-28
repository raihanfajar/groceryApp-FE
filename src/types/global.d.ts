// Definisikan tipe spesifik untuk hasil transaksi
export interface SnapTransactionResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status:
    | "capture"
    | "settlement"
    | "pending"
    | "deny"
    | "expire"
    | "cancel";
  fraud_status: "accept" | "deny" | "challenge";
  va_numbers?: {
    bank: string;
    va_number: string;
  }[];
  permata_va_number?: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface SnapErrorResult {
  status_code: string;
  status_message: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        params?: {
          onSuccess?: (result: SnapTransactionResult) => void;
          onPending?: (result: SnapTransactionRIesult) => void;
          onError?: (result: SnapErrorResult) => void;
          onClose?: () => void;
        },
      ) => void;
    };
  }
}
