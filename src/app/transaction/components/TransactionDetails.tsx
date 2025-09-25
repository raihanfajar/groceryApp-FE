import { Transaction } from "@/types/transaction/transactionTypes";
import { formatDateToIndonesian } from "@/utils/FormatDate";

function TransactionDetails({ transaction }: { transaction: Transaction }) {
  return (
    <div className="mb-5 w-full rounded-lg border bg-white p-4 shadow-sm md:w-96">
      <h3 className="mb-3 border-b pb-2 text-lg font-semibold text-gray-800">
        Order Details
      </h3>
      <div className="grid grid-cols-[120px_1fr] gap-y-2 text-sm">
        <span className="text-gray-600">Status</span>
        <span className="font-medium text-gray-900">{transaction.status}</span>

        <span className="text-gray-600">Order Number</span>
        <span className="font-medium text-gray-900">{transaction.id}</span>

        <span className="text-gray-600">Order Date</span>
        <span className="font-medium text-gray-900">
          {formatDateToIndonesian(transaction.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default TransactionDetails;
