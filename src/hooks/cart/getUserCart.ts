import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import {
  Cart,
  CartItemWithPromo,
  UpdateQuantityPayload,
} from "@/types/cart/getUserCart";
import { ApiResponse } from "@/types/apiResponse";
import { toast } from "react-toastify";
import { baseError } from "@/components/userAuth/typesAndInterfaces";

export const CART_QUERY_KEY = ["userCart"];

// Ambil cart user
async function fetchUserCart(): Promise<Cart | null> {
  const { accessToken } = useUserAuthStore.getState();
  const response = await axiosInstance.get<ApiResponse<{ cart: Cart | null }>>(
    "/cart/user",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  return response.data.data.cart ?? null;
}

// Update quantity satu item
async function updateCartItem(
  payload: UpdateQuantityPayload,
): Promise<CartItemWithPromo | null> {
  const { accessToken } = useUserAuthStore.getState();
  const response = await axiosInstance.put<
    ApiResponse<{ cart: CartItemWithPromo | null }>
  >("/cart/update", payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.data.cart ?? null;
}

export function useUserCart(options?: { enabled?: boolean }) {
  return useQuery<Cart | null, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchUserCart,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60,
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  type MutationContext = { previousCart: Cart | null | undefined };

  return useMutation<
    CartItemWithPromo | null,
    baseError,
    UpdateQuantityPayload,
    MutationContext
  >({
    mutationFn: updateCartItem,

    // Optimistic update
    onMutate: async (newItem): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY });
      const previousCart = queryClient.getQueryData<Cart | null>(
        CART_QUERY_KEY,
      );

      if (previousCart) {
        let updatedItems = previousCart.items.map((item) =>
          item.productId === newItem.productId &&
          item.storeId === newItem.storeId
            ? { ...item, quantity: newItem.quantity }
            : item,
        );

        // Hapus kalau quantity 0
        updatedItems = updatedItems.filter((item) => item.quantity > 0);

        queryClient.setQueryData(CART_QUERY_KEY, {
          ...previousCart,
          items: updatedItems,
        });
      }

      return { previousCart };
    },

    // Rollback kalau gagal
    onError: (err: baseError, _vars, context) => {
      // Kembalikan UI ke kondisi semula (rollback)
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }

      // Ambil pesan error dari respons backend
      const errorMessage =
        err?.response?.data?.message || "Something went wrong";

      // Tampilkan notifikasi toast error
      toast.error(errorMessage);
    },

    // Sync ulang data dengan server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}
