import { ApiResponse } from "@/types/apiResponse";
import { CartResponse } from "@/types/cart/getUserCart";
import { axiosInstance } from "@/utils/axiosInstance";

export const getUserCart = async () => {
    const {accessToken} = userAuthStore();

  const res = await axiosInstance.get<ApiResponse<{ cart: CartResponse }>>(
    `/cart/user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data.data.cart;
};
