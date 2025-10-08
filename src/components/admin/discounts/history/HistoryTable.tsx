import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, DollarSign } from "lucide-react";
import { DiscountUsageHistory } from "@/types/discount";
import {
  getDiscountTypeColor,
  getDiscountTypeLabel,
} from "@/utils/discountHelpers";

interface HistoryTableProps {
  history: DiscountUsageHistory[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Discount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Discount Value</TableHead>
          <TableHead>Order Total</TableHead>
          <TableHead>Applied By</TableHead>
          <TableHead>Date Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="font-medium">{item.discount.name}</div>
            </TableCell>
            <TableCell>
              <Badge className={getDiscountTypeColor(item.discount.type)}>
                {getDiscountTypeLabel(item.discount.type)}
              </Badge>
            </TableCell>
            <TableCell>
              {item.user ? (
                <div>
                  <div className="font-medium">{item.user.name}</div>
                  <div className="text-sm text-gray-500">{item.user.email}</div>
                </div>
              ) : (
                <span className="text-gray-400">System</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">
                  Rp {item.discountValue.toLocaleString()}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium">
                Rp {item.orderTotal.toLocaleString()}
              </span>
            </TableCell>
            <TableCell>
              {item.appliedBy ? (
                <div className="text-sm">
                  <div className="font-medium">Manual</div>
                  <div className="text-gray-500">by {item.appliedBy.name}</div>
                </div>
              ) : (
                <span className="text-sm text-gray-500">System Applied</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="h-3 w-3 text-gray-400" />
                <div>
                  <div>{new Date(item.usedAt).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.usedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
