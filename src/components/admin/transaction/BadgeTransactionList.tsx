import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status =
  | "waiting_payment"
  | "waiting_confirmation"
  | "on_process"
  | "shipped"
  | "completed"
  | "cancelled";

interface TransactionStatusBadgeProps {
  status: Status;
}

export function TransactionStatusBadge({
  status,
}: TransactionStatusBadgeProps) {
  const statusStyles: Record<Status, string> = {
    waiting_payment: "bg-yellow-100 text-yellow-800 border-yellow-300",
    waiting_confirmation: "bg-blue-100 text-blue-800 border-blue-300",
    on_process: "bg-indigo-100 text-indigo-800 border-indigo-300",
    shipped: "bg-purple-100 text-purple-800 border-purple-300",
    completed: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", statusStyles[status] || "bg-gray-100")}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
