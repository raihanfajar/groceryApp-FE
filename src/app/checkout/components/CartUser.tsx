import { CartItemWithPromo } from "@/types/cart/getUserCart";
import formatCurrency from "@/utils/FormatCurrency";
import React from "react";

function CartUser({ item }: { item: CartItemWithPromo }) {
  const { product, quantity, activePrice, discountAmount } = item;
  const basePrice = activePrice + discountAmount;
  return (
    <>
      {/* Desktop View */}
      <div className="mt-2 hidden items-center border-b-2 py-4 text-gray-800 md:flex">
        <div className="flex w-5/12 items-center gap-6">
          <div className="avatar">
            <div className="mask mask-squircle h-16 w-16">
              <img
                src={
                  product.picture1 ||
                  "https://placehold.co/100x100/e2e8f0/adb5bd?text=Produk"
                }
                alt={product.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="line-clamp-2 font-medium break-words">
              {product.name}
            </div>
          </div>
        </div>

        <div className="w-2/12 text-center font-medium">{quantity} Pcs</div>

        <div className="flex w-2/12 items-center gap-3">
          {discountAmount > 0 && (
            <div className="text-sm text-gray-500 line-through">
              {formatCurrency(basePrice)}
            </div>
          )}
          <div className="">{formatCurrency(activePrice)}</div>
        </div>

        <div className="w-3/12 text-center text-l">
          {formatCurrency(activePrice * quantity)}
        </div>
      </div>

      {/* Mobile View */}
      <div className="w-full border-b py-3 md:hidden">
        <div className="flex items-start gap-4 px-1 pt-1 pb-2">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14">
              <img
                src={
                  product.picture1 ||
                  "https://placehold.co/100x100/e2e8f0/adb5bd?text=Produk"
                }
                alt={product.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="line-clamp-2 text-base font-semibold break-words">
              {product.name}
            </div>
            <div className="flex items-center gap-3">
              {discountAmount > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(basePrice)}
                </div>
              )}
              <div className="text-sm font-medium">
                {formatCurrency(activePrice)}
              </div>
            </div>
            <div className="mt-2 ml-auto flex items-baseline gap-4">
              <span className="text-sm text-gray-600">Qty: {quantity}</span>
              <span className="font-lg">
                {formatCurrency(activePrice * quantity)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartUser;
