import { Clock } from "lucide-react";

interface EmptyHistoryStateProps {
  hasSearchTerm: boolean;
}

export default function EmptyHistoryState({
  hasSearchTerm,
}: EmptyHistoryStateProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Clock className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No usage history found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasSearchTerm
          ? "Try adjusting your search criteria."
          : "Discount usage will appear here when customers use discounts or when admins apply them manually."}
      </p>
      {!hasSearchTerm && (
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-left">
          <p className="text-xs text-blue-700">
            <strong>💡 Tip:</strong> To see discount usage:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-blue-600">
            <li>Create an active discount</li>
            <li>Have customers apply it during checkout</li>
            <li>Or manually apply discounts to orders</li>
          </ul>
        </div>
      )}
    </div>
  );
}
