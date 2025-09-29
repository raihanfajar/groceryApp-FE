import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Custom hook that provides store-specific query keys for admin-related queries
 * and handles cache clearing when admin auth state changes
 */
export const useAdminQueryKeys = () => {
  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  // Create store-specific query keys
  const getQueryKey = (baseKey: string) => {
    return [baseKey, admin?.id, admin?.store?.id];
  };

  const queryKeys = {
    discounts: getQueryKey("discounts"),
    discountHistory: getQueryKey("discountHistory"),
    products: getQueryKey("admin-products"),
    users: getQueryKey("admin-users"),
    stores: getQueryKey("admin-stores"),
  };

  // Clear all admin-related cache when admin changes (logout/login as different admin)
  useEffect(() => {
    return () => {
      // This effect cleanup runs when admin changes
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as string[];
          return queryKey.some(
            (key) =>
              typeof key === "string" &&
              (key.includes("discounts") ||
                key.includes("admin-") ||
                key.includes("History") ||
                key.includes("users") ||
                key.includes("stores")),
          );
        },
      });
    };
  }, [admin?.id, admin?.store?.id, queryClient]);

  return {
    queryKeys,
    getQueryKey,
    invalidateDiscounts: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.discounts }),
    invalidateDiscountHistory: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.discountHistory }),
    clearAllAdminCache: () => {
      queryClient.clear();
    },
  };
};
