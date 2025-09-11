"use client";

import React from "react";
import CartTable from "./components/CartTable";
import CartSumary from "./features/CartSumary";
import { CART_QUERY_KEY } from "@/hooks/cart/getUserCart";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import EmptyCart from "./components/EmptyCart";

type CartCountResponse = {
  message: string;
  data: {
    count: number;
  };
};

function Cart() {
  const { accessToken } = useUserAuthStore();

  const { data: cartData } = useQuery<CartCountResponse | null>({
    queryKey: [...CART_QUERY_KEY, "count"],
    queryFn: async () => {
      if (!accessToken) return null;
      const response = await axiosInstance.get<CartCountResponse>(
        "/cart/count",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    },
    enabled: !!accessToken,
  });

  const cartItemCount = cartData?.data?.count || 0;

  return (
    <section className="container mx-auto min-h-screen px-4 pt-14">
      <div className="text-primary mb-5 text-3xl font-medium">CART</div>
      {cartItemCount > 0 ? (
        <>
          <CartTable />
          <CartSumary />
        </>
      ) : (
        <EmptyCart />
      )}
    </section>
  );
}

export default Cart;
