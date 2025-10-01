import { CartItemWithPromo } from "@/types/cart/getUserCart";

export const useCartItemLogic = ({
  item,
  isUpdating,
  onUpdateQuantity,
  onPromptDelete,
}: {
  item: CartItemWithPromo;
  isUpdating: boolean;
  onUpdateQuantity: (
    productId: string,
    storeId: string,
    newQuantity: number,
  ) => void;
  onPromptDelete: (item: CartItemWithPromo) => void;
}) => {
  const {
    product,
    quantity = 0,
    activePrice = 0,
    discountAmount = 0,
    storeId,
    availability,
  } = item;

  const basePrice = activePrice + discountAmount;
  const currentStock = Number(availability?.currentStock ?? 0);
  const isAvailable = availability?.status === "AVAILABLE";

  const statusMessage = isAvailable
    ? ""
    : availability?.status === "OUT_OF_STOCK"
      ? "Not enough stock!"
      : "Not available!";

  const handleUpdate = (newQuantity: number) => {
    if (isUpdating || !isAvailable || !product) return;
    if (newQuantity > currentStock) return;
    if (newQuantity === 0) {
      onPromptDelete(item);
    } else {
      onUpdateQuantity(product.id, storeId, newQuantity);
    }
  };

  return {
    product,
    quantity,
    activePrice,
    discountAmount,
    basePrice,
    currentStock,
    isAvailable,
    statusMessage,
    handleUpdate,
  };
};
