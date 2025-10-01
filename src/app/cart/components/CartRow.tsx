"use client";

import { useCartItemLogic } from "@/hooks/cart/cartItemLogic";
import { CartItemWithPromo } from "@/types/cart/getUserCart";
import formatCurrency from "@/utils/FormatCurrency";
import { TrashIcon } from "lucide-react";
import Image from "next/image";

type CartRowProps = {
  item: CartItemWithPromo;
  isUpdating: boolean;
  onUpdateQuantity: (
    productId: string,
    storeId: string,
    newQuantity: number,
  ) => void;
  onPromptDelete: (item: CartItemWithPromo) => void;
};

const CartRow = (props: CartRowProps) => {
  const {
    product,
    quantity,
    activePrice,
    discountAmount,
    basePrice,
    currentStock,
    isAvailable,
    statusMessage,
    handleUpdate,
  } = useCartItemLogic(props);

  return (
    <>
      {/* Desktop View */}
      <div
        className={`text-secondary mt-2 hidden items-center border-b-2 py-2 md:flex ${!isAvailable ? "bg-gray-50 text-gray-500" : ""}`}
      >
        <div className="flex w-4/12 items-center gap-10">
          <div className="avatar">
            <div
              className={`mask mask-squircle h-14 w-14 ${!isAvailable ? "grayscale" : ""}`}
            >
              <Image
                src={product.picture1 || "/placeholder.jpg"}
                alt={product.name}
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="line-clamp-2 font-medium break-words">
              {product.name}
            </div>
            {!isAvailable && (
              <div className="mt-1 text-xs font-semibold text-red-500">
                {statusMessage}
              </div>
            )}
          </div>
        </div>
        <div className="w-2/12">
          {isAvailable ? (
            <div className="flex items-center">
              <button
                onClick={() => handleUpdate(quantity - 1)}
                disabled={props.isUpdating}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <div className="mx-1 flex h-8 min-w-10 items-center justify-center border-b px-3">
                {quantity}
              </div>
              <button
                onClick={() => handleUpdate(quantity + 1)}
                disabled={props.isUpdating || quantity >= currentStock}
                className="flex h-8 w-8 items-center justify-center rounded-lg border-2 font-bold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <div className="text-center font-semibold text-gray-500">
              {quantity}
            </div>
          )}
        </div>
        <div className="flex w-2/12 items-center gap-5">
          {discountAmount > 0 && (
            <div className="line-through">{formatCurrency(basePrice)}</div>
          )}
          <div>{formatCurrency(activePrice)}</div>
        </div>
        <div className="flex w-3/12 items-center justify-center">
          {formatCurrency(activePrice * quantity)}
        </div>
        <div className="flex w-1/12 items-center justify-center">
          {!isAvailable && (
            <button
              onClick={() => props.onPromptDelete(props.item)}
              className="text-red-500 hover:text-red-700"
              title="Delete item"
              aria-label="Delete item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div
        className={`w-full border-b py-2 md:hidden ${!isAvailable ? "bg-gray-50 text-gray-500" : ""}`}
      >
        <div className="flex items-start gap-4 px-1 pt-1 pb-2">
          <div className="avatar">
            <div
              className={`mask mask-squircle h-12 w-12 ${!isAvailable ? "grayscale" : ""}`}
            >
              <Image
                src={product.picture1 || "/placeholder.jpg"}
                alt={product.name}
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="text-medium line-clamp-2 font-medium break-words">
              {product.name}
            </div>
            <div className="items-center gap-5">
              {discountAmount > 0 && (
                <div className="text-sm line-through">
                  {formatCurrency(basePrice)}
                </div>
              )}
              <div className="text-sm">{formatCurrency(activePrice)}</div>
            </div>
            {!isAvailable && (
              <div className="mt-1 text-xs font-semibold text-red-500">
                {statusMessage}
              </div>
            )}
            <div className="mt-1 ml-auto flex items-center gap-2">
              <div className="text-sm">
                {formatCurrency(activePrice * quantity)}
              </div>
              {isAvailable ? (
                <>
                  <button
                    onClick={() => handleUpdate(quantity + 1)}
                    disabled={props.isUpdating || quantity >= currentStock}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <div className="inline-flex h-7 w-7 items-center justify-center border-b tabular-nums">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleUpdate(quantity - 1)}
                    disabled={props.isUpdating}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 font-bold"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                </>
              ) : (
                <button
                  onClick={() => props.onPromptDelete(props.item)}
                  className="btn btn-outline btn-error btn-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartRow;
