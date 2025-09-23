import { ApiResponse } from "@/types/apiResponse";
import { Voucher } from "@/types/voucher/voucherInterface";
import { axiosInstance } from "@/utils/axiosInstance";

export const getProductVoucher = async (code: string) => {
  const res = await axiosInstance.get<ApiResponse<{ voucher: Voucher }>>(
    `/voucher/product?code=${code}`,
  );
  return res.data.data.voucher;
};

export const getDeliveryVoucher = async (code: string) => {
  const res = await axiosInstance.get<ApiResponse<{ voucher: Voucher }>>(
    `/voucher/delivery?code=${code}`,
  );
  return res.data.data.voucher;
};