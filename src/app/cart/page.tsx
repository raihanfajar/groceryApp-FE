import React from "react";
import CartHead from "./components/CartHead";
import EmptyCart from "./components/EmptyCart";

function Cart() {
  return (
    <section className="container mx-auto px-4 pt-14 min-h-screen">
      <div className="text-primary text-3xl font-medium mb-5">CART</div>
      {/* <EmptyCart /> */}
      <CartHead />
    </section>
  );
}

export default Cart;
