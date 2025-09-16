/**
 * Format number as currency in Indonesian Rupiah
 */
export const formatCurrency = (amount: number | string): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (currencyString: string): number => {
  const cleaned = currencyString.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("id-ID").format(num);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (
  originalPrice: number,
  discountedPrice: number,
): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Format discount display
 */
export const formatDiscount = (
  originalPrice: number,
  discountedPrice: number,
): string => {
  const percentage = calculateDiscountPercentage(
    originalPrice,
    discountedPrice,
  );
  return `${percentage}% OFF`;
};
