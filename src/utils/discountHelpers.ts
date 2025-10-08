import { DiscountType } from "@/types/discount";

export function getDiscountTypeColor(type: DiscountType): string {
  switch (type) {
    case DiscountType.MANUAL:
      return "bg-blue-100 text-blue-800";
    case DiscountType.MINIMUM_PURCHASE:
      return "bg-green-100 text-green-800";
    case DiscountType.BOGO:
      return "bg-purple-100 text-purple-800";
    case DiscountType.REGULAR:
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getDiscountTypeLabel(type: DiscountType): string {
  switch (type) {
    case DiscountType.MANUAL:
      return "Manual";
    case DiscountType.MINIMUM_PURCHASE:
      return "Min Purchase";
    case DiscountType.BOGO:
      return "BOGO";
    case DiscountType.REGULAR:
      return "Regular";
    default:
      return type;
  }
}
