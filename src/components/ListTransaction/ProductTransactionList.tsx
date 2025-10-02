import { TransactionProductFinal } from "@/types/transaction/FinalTypes";
import formatCurrency from "@/utils/FormatCurrency";
import Image from "next/image";
import React from "react";

function ProductTransactionList({ item }: { item: TransactionProductFinal }) {
  const { product, quantity, price, discount, finalPrice } = item;
  const basePrice = price;
  const activePrice = price - discount;
  return (
    <>
      {/* Desktop View */}
      <div className="mt-3 hidden items-center border-b bg-white text-gray-800 lg:flex">
        <div className="flex w-5/12 items-center gap-6">
          <div className="avatar">
            <div className="mask mask-squircle h-16 w-16">
              <Image
                src={
                  product.picture1 ||
                  "https://placehold.co/100x100/e2e8f0/adb5bd?text=Produk"
                }
                alt={product.name}
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="line-clamp-2 text-base font-medium break-words">
              {product.name}
            </div>
          </div>
        </div>

        <div className="w-2/12 text-center text-base font-medium">
          {quantity} Pcs
        </div>

        <div className="flex w-2/12 items-center gap-3">
          {discount > 0 && (
            <div className="text-sm text-gray-500 italic line-through">
              {formatCurrency(basePrice)}
            </div>
          )}
          <div>{formatCurrency(activePrice)}</div>
        </div>

        <div className="text-l w-3/12 text-center font-semibold">
          {formatCurrency(finalPrice)}
        </div>
      </div>

      {/* Mobile View */}
      <div className="mt-2 w-full border-b lg:hidden">
        <div className="flex items-start gap-4 px-1 pt-1 pb-2">
          <div className="avatar">
            <div className="mask mask-squircle h-14 w-14">
              <Image
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
            <div className="line-clamp-2 text-sm font-semibold break-words">
              {product.name}
            </div>
            <div className="flex items-center gap-3">
              {discount > 0 && (
                <div className="text-xs text-gray-500 italic line-through">
                  {formatCurrency(basePrice)}
                </div>
              )}
              <div className="text-xs font-semibold">
                {formatCurrency(activePrice)}
              </div>
            </div>
            <div className="mt-2 ml-auto flex items-baseline gap-4">
              <span className="text-sm text-gray-600">Qty: {quantity}</span>
              <span className="font-lg text-sm">
                {formatCurrency(finalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductTransactionList;
