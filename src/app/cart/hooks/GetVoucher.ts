import { axiosInstance } from "@/utils/axiosInstance";
import { VoucherResponse } from "./types/voucherInterface";

export const getProductVoucher = async (code: string) => {
    const res = await axiosInstance.get<VoucherResponse>(`/voucher/product?code=${code}`);
    return res.data.data.voucher;
};