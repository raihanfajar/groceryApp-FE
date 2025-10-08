import { Percent as PercentIcon } from "lucide-react";

interface EmptyDiscountStateProps {
  hasSearchTerm: boolean;
}

export default function EmptyDiscountState({
  hasSearchTerm,
}: EmptyDiscountStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <PercentIcon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No discounts found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasSearchTerm
          ? "Try adjusting your search criteria."
          : "Get started by creating your first discount."}
      </p>
    </div>
  );
}
