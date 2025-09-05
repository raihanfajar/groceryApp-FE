import React from "react";
import EmptyCart from "./components/EmptyCart";
import CartTable from "./components/CartTable";
import CartSumary from "./features/CartSumary";

function Cart() {
  return (
    <section className="container mx-auto min-h-screen px-4 pt-14">
      <div className="text-primary mb-5 text-3xl font-medium">CART</div>
      {/* <EmptyCart /> */}
      <CartTable />
      <CartSumary />
    </section>
  );
}

export default Cart;
