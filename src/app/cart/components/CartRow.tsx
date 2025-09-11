"use client";

import { CartItemWithPromo } from "@/types/cart/getUserCart";
import formatCurrency from "@/utils/FormatCurrency";
import Image from "next/image";

type CartRowProps = {
  item: CartItemWithPromo;
  isUpdating: boolean;
  onUpdateQuantity: (productId: string, storeId: string, newQuantity: number) => void;
  onPromptDelete: (item: CartItemWithPromo) => void;
};

const CartRow = ({ item, isUpdating, onUpdateQuantity, onPromptDelete }: CartRowProps) => {
  const { product, quantity, activePrice, discountAmount, storeId } = item;
  const basePrice = activePrice + discountAmount;

  const handleUpdate = (newQuantity: number) => {
    if (isUpdating) return;
    if (newQuantity === 0) {
      onPromptDelete(item);
    } else {
      onUpdateQuantity(product.id, storeId, newQuantity);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="text-secondary mt-2 hidden h-16 items-center border-b-2 md:flex">
        <div className="flex w-4/12 items-center gap-10">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14">
              <Image
                src={product.picture1 || "/placeholder.jpg"}
                alt={product.name}
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="line-clamp-2 font-medium break-words">{product.name}</div>
        </div>
        <div className="w-2/12">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleUpdate(quantity - 1)}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
            >
              -
            </button>
            <div className="mx-1 flex h-8 min-w-10 items-center justify-center border-b px-3">
              <span>{quantity}</span>
            </div>
            <button
              type="button"
              onClick={() => handleUpdate(quantity + 1)}
              disabled={isUpdating}
              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex w-3/12 items-center gap-5">
          {discountAmount > 0 && (
            <div className="text-gray-600 line-through">{formatCurrency(basePrice)}</div>
          )}
          <div className="">{formatCurrency(activePrice)}</div>
        </div>
        <div className="flex w-3/12 items-center justify-center">{formatCurrency(activePrice * quantity)}</div>
      </div>

      {/* Mobile View */}
      <div className="w-full md:hidden">
        <div className="flex items-start gap-4 border-b px-1 pt-3 pb-2">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <Image
                src={product.picture1 || "/placeholder.jpg"}
                alt={product.name}
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="text-medium line-clamp-2 font-medium break-words">{product.name}</div>
            <div className="items-center gap-5">
              {discountAmount > 0 && (
                <div className="text-gray-600 line-through">{formatCurrency(basePrice)}</div>
              )}
              <div className="">{formatCurrency(activePrice)}</div>
            </div>
            <div className="mt-1 ml-auto flex items-center gap-2">
              <button
                onClick={() => handleUpdate(quantity + 1)}
                disabled={isUpdating}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
              >
                +
              </button>
              <div className="inline-flex h-7 w-7 items-center justify-center border-b tabular-nums">
                {quantity}
              </div>
              <button
                onClick={() => handleUpdate(quantity - 1)}
                disabled={isUpdating}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold text-[#00a63e]"
              >
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