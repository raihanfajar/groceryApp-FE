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
export function useUserCart(options?: { enabled?: boolean }) {
  const { accessToken } = useUserAuthStore();

  return useQuery<Cart | null, Error>({
    queryKey: [...CART_QUERY_KEY, accessToken],

    queryFn: async () => {
      if (!accessToken) {
        return null;
      }

      const response = await axiosInstance.get<
        ApiResponse<{ cart: Cart | null }>
      >("/cart/user", { headers: { Authorization: `Bearer ${accessToken}` } });
      return response.data.data.cart ?? null;
    },

    enabled: !!accessToken && (options?.enabled ?? true),

    staleTime: 1000 * 60,
  });
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

    onError: (err: baseError, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEY, context.previousCart);
      }

      const errorMessage =
        err?.response?.data?.message || "Something went wrong";

      toast.error(errorMessage);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

// Add product to cart
export function useAddCartProduct() {
  const queryClient = useQueryClient();
  const { accessToken, targetStore } = useUserAuthStore();

  const mutation = useMutation<
    ApiResponse<{ cart: Cart }>,
    baseError,
    { productId: string }
  >({
    mutationFn: async (input) => {
      if (!input?.productId) throw new Error("productId is required");

      const storeId = targetStore?.id ?? "c2c71ef0-0f43-4b58-b222-22d465bb88c2";
      const payload = {
        storeId: storeId,
        productId: String(input.productId),
      };

      const url = `/cart/add`;
      const response = await axiosInstance.post<ApiResponse<{ cart: Cart }>>(
        url,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product added to cart!");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: (err: unknown) => {
      const customError = err as baseError;
      const errorMessage =
        customError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    },
  });

  const guardedMutate = (variables: { productId: string }) => {
    if (!accessToken) {
      toast.error("Please login first");
      return;
    }
    mutation.mutate(variables);
  };

  return { ...mutation, mutate: guardedMutate };
}
