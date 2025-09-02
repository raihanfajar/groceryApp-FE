import React from "react";
import CartRow from "./CartRow";

const CartHead = () => {
  return (
    <div className="overflow-x-auto">
      {/* Desktop */}
      <div className="hidden w-full md:block">
        <div className="text-primary flex w-full items-center border-b-2 border-black font-medium">
          <div className="w-4/12">Added Items</div>
          <div className="w-2/12">Quantity</div>
          <div className="w-3/12">Price</div>
          <div className="w-3/12">Total</div>
        </div>
        <div className="w-full">
          <CartRow />
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <div className="w-full items-center">
          <div className="text-primary flex items-center  border-b-2 border-black">
            <div className="w-[64%]">Added Items</div>
            <div >Total</div>
          </div>
        </div>
        <CartRow />
      </div>
    </div>
  );
};

export default CartHead;
