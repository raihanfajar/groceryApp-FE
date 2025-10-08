"use client";

import { useUpdateCartQuantity, useUserCart } from "@/hooks/cart/getUserCart";
import { CartItemWithPromo } from "@/types/cart/getUserCart";
import { useState } from "react";
import CartRow from "./CartRow";
import ConfirmationModal from "./ConfirmationModel";
import EmptyCart from "./EmptyCart";

const CartTable = () => {
  const { data: cart, isLoading, isError } = useUserCart();
  const { mutate: updateQuantity, isPending: isUpdating } =
    useUpdateCartQuantity();
  const [itemToDelete, setItemToDelete] = useState<CartItemWithPromo | null>(
    null,
  );

  const handlePromptDelete = (item: CartItemWithPromo) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      updateQuantity({
        productId: itemToDelete.productId,
        storeId: itemToDelete.storeId,
        quantity: 0,
      });
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading Cart...</div>;
  if (isError)
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load Cart
      </div>
    );
  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        {/* Desktop */}
        <div className="hidden w-full md:block">
          <div className="text-primary flex w-full items-center border-b-2 border-black font-medium">
            <div className="w-4/12">Items</div>
            <div className="w-2/12">Quantity</div>
            <div className="w-3/12">Price</div>
            <div className="flex w-3/12 items-center justify-center">Total</div>
          </div>
          <div className="w-full">
            {cart.items.map((item) => (
              <CartRow
                key={item.id}
                item={item}
                isUpdating={isUpdating}
                onUpdateQuantity={(productId, storeId, quantity) => {
                  updateQuantity({ productId, storeId, quantity });
                }}
                onPromptDelete={handlePromptDelete}
              />
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <div className="w-full items-center">
            <div className="text-primary flex items-center border-b-2 border-black">
              <div className="w-[64%]">Items</div>
            </div>
          </div>
          {cart.items.map((item) => {
            return (
              <CartRow
                key={item.id}
                item={item}
                isUpdating={isUpdating}
                onUpdateQuantity={(productId, storeId, quantity) => {
                  updateQuantity({ productId, storeId, quantity });
                }}
                onPromptDelete={handlePromptDelete}
              />
            );
          })}
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!itemToDelete}
        itemName={itemToDelete?.product.name || ""}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default CartTable;
