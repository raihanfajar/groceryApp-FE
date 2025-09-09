import { ApiResponse } from "@/types/apiResponse";
import { axiosInstance } from "@/utils/axiosInstance";
import { Voucher } from "./types/voucherInterface";

export const getProductVoucher = async (code: string) => {
  const res = await axiosInstance.get<ApiResponse<{ voucher: Voucher }>>(
    `/voucher/product?code=${code}`,
  );
  return res.data.data.voucher;
};
