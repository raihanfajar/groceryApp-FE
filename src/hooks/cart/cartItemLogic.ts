import { CartItemWithPromo } from "@/types/cart/getUserCart";

type CartItemLogicProps = {
  item: CartItemWithPromo;
  isUpdating: boolean;
  onUpdateQuantity: (
    productId: string,
    storeId: string,
    newQuantity: number,
  ) => void;
  onPromptDelete: (item: CartItemWithPromo) => void;
};

export const useCartItemLogic = (props: CartItemLogicProps) => {
  const { item, isUpdating, onUpdateQuantity, onPromptDelete } = props;

  const {
    product,
    quantity = 0,
    activePrice = 0,
    discountAmount = 0,
    storeId,
    availability,
  } = item;

  const basePrice = product.price;

  const currentStock = Number(availability?.currentStock ?? 0);
  const isAvailable = availability?.status === "AVAILABLE";

  const statusMessage = isAvailable
    ? ""
    : availability?.status === "OUT_OF_STOCK"
      ? "Not enough stock!"
      : "Not available!";

  const handleUpdate = (newQuantity: number) => {
    if (isUpdating || !isAvailable || !product) return;
    if (newQuantity > currentStock && currentStock > 0) return;

    if (newQuantity < 1) {
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
