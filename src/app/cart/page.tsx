"use client";

import React from "react";
import CartTable from "./components/CartTable";
import CartSumary from "./features/CartSumary";
import EmptyCart from "./components/EmptyCart";
import UserAuthGuard from "@/providers/UserAuthGuard";
import { useUserCart } from "@/hooks/cart/getUserCart";

export default function Cart() {
  const { data: cart, isLoading, isError } = useUserCart();

  const items = cart?.items ?? [];

  const hasItems = Array.isArray(items) && items.length > 0;

  if (isLoading) {
    return (
      <UserAuthGuard>
        <section className="container mx-auto min-h-screen px-4 pt-14">
          <div className="text-primary mb-5 text-3xl font-medium">CART</div>
          <div className="mt-20 flex items-center justify-center">Loading cart…</div>
        </section>
      </UserAuthGuard>
    );
  }

  if (isError) {
    return (
      <UserAuthGuard>
        <section className="container mx-auto min-h-screen px-4 pt-14">
          <div className="text-primary mb-5 text-3xl font-medium">CART</div>
          <div className="mt-8 text-center text-red-500">Failed to load cart. Please try again.</div>
        </section>
      </UserAuthGuard>
    );
  }

  return (
    <UserAuthGuard>
      <section className="container mx-auto min-h-screen px-4 pt-14">
        <div className="text-primary mb-5 text-3xl font-medium">CART</div>

        {hasItems ? (
          <>
            <CartTable />
            <CartSumary />
          </>
        ) : (
          <EmptyCart />
        )}
      </section>
    </UserAuthGuard>
  );
}
