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
          <div className="line-clamp-2 font-medium break-words">
            Nissin Cracker
          </div>
        </div>
        <div className="w-2/12">
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
            >
              +
            </button>
            <div className="mx-1 flex h-8 min-w-10 items-center justify-center border-b px-3">
              <span>2</span>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
            >
              –
            </button>
          </div>
        </div>
        <div className="flex w-3/12 items-center gap-5">
          <div className="text-gray-600 line-through">Rp 100.000</div>
          <div className=""> Rp 89.000</div>
        </div>
        <div className="flex w-3/12 items-center justify-center">
          Rp 178.000
        </div>
      </div>

      {/* Mobile View */}
      <div className="w-full md:hidden">
        <div className="flex items-start gap-4 border-b px-1 pt-3 pb-2">
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

          <div className="flex flex-1 flex-col gap-1">
            <div className="text-medium line-clamp-2 font-medium break-words">
              Nissin Cracker
            </div>
            <div className="items-center gap-5">
              <div className="text-gray-600 line-through">Rp 100.000</div>
              <div className=""> Rp 89.000</div>
            </div>
            <div className="mt-1 ml-auto flex items-center gap-2">
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]">
                +
              </button>
              <div className="inline-flex h-7 w-7 items-center justify-center border-b tabular-nums">
                2
              </div>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]">
                -
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartRow;
