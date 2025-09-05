export interface Voucher {
  code: string;
  discount: number;
  quota: number;
  maxDiscount: number;
  expiredDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VoucherResponse {
  message: string;
  data: {
    voucher: Voucher;
  };
}