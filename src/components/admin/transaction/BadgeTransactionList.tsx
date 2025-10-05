import { TransactionFinal } from "@/types/transaction/FinalTypes";
import { cn } from "@/lib/utils";
type OrderStatus = TransactionFinal["status"];

type Props = {
  status: OrderStatus;
};

const statusStyles: Record<OrderStatus, string> = {
  waiting_payment: "bg-yellow-100 text-yellow-800",
  waiting_confirmation: "bg-blue-100 text-blue-800",
  on_process: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function TransactionStatusBadge({ status }: Props) {
  const formattedStatus = status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 text-xs leading-5 font-semibold",
        statusStyles[status],
      )}
    >
      {formattedStatus}
    </span>
  );
}
