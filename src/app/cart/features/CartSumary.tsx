import React from "react";

function CartSumary() {
  return (
    <div className="mt-14 w-full gap-y-10 md:mt-20 md:flex md:flex-row md:justify-between md:gap-x-10 md:[&>*+*]:ml-0">
      <div className="md:max-w-l">
        <div className="text-primary mb-2 font-medium">Voucher Code : </div>
        <div className="flex gap-8">
          <input
            type="text"
            className="w-[55%] gap-7 space-y-7 border-b-2 px-2 md:max-w-lg"
            placeholder="Enter Voucher Code"
          />
          <button className="w-[40%] rounded-md bg-[#00a63e] p-2 font-medium text-white md:w-28">
            Apply
          </button>
        </div>
      </div>
      <div className="mt-12 w-full md:mt-0 md:mr-3 md:w-sm lg:mr-0">
        <div className="flex justify-between border-b-2">
          <div className="text-primary">Subtotal: </div>
          <div className="text-primary font-medium">Rp. 0</div>
        </div>
        <div className="mt-7 flex justify-between border-b-2">
          <div className="text-primary">Discount: </div>
          <div className="text-primary font-medium">Rp. 0</div>
        </div>
        <div className="mt-7 flex justify-between border-b-2">
          <div className="text-primary">Grand Total: </div>
          <div className="text-primary font-medium">Rp. 0</div>
        </div>
        <button className="mt-7 w-full rounded-md bg-[#00a63e] p-2 font-medium text-white">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default CartSumary;
