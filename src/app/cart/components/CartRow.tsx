"use client";

import Image from "next/image";
import { PiTrashBold } from "react-icons/pi";

const CartRow = () => {
  return (
    <>
      {/* Desktop View (tampil di layar md ke atas) */}
      <div className="text-secondary mt-2 hidden h-16 items-center border-b-2 md:flex">
        <div className="flex w-4/12 items-center gap-10">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14">
              <Image
                src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                alt="Produk"
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="font-medium">Nissin Cracker</div>
        </div>
        <div className="w-2/12">
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-l border"
            >
              +
            </button>
            <div className="flex h-8 min-w-10 items-center justify-center border-y px-3">
              <span>2</span>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-r border"
            >
              –
            </button>
          </div>
        </div>
        <div className="w-3/12">Rp 100.000</div>
        <div className="flex w-3/12 items-center">
          <span>Rp 200.000</span>
          <button type="button" aria-label="Delete Item" className="ml-auto">
            <PiTrashBold className="text-xl text-red-600" />
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center border-b px-1 py-3">
          <div className="flex w-[64%] gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <Image
                  src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                  alt="Produk"
                  width={100}
                  height={100}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">Nissin Cracker</p>
              <p className="text-medium opacity-70">Rp 100.000</p>
              <div className="mt-2 flex items-center">
                <button className="h-7 w-7 items-center border">+</button>
                <div className="flex h-7 min-w-7 items-center justify-center border">
                  2
                </div>
                <button className="h-7 w-7 items-center border">-</button>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium">Rp 200.000</p>
            <div className="ml-20">
              <button
                type="button"
                aria-label="Delete Item"
                className="mt-4 items-center"
              >
                <PiTrashBold className="text-xl text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartRow;
