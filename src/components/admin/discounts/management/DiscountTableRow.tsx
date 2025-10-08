import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Discount, DiscountValueType } from "@/types/discount";
import {
  getDiscountTypeColor,
  getDiscountTypeLabel,
} from "@/utils/discountHelpers";

interface DiscountTableRowProps {
  discount: Discount;
  isSuper: boolean;
  onEdit: (discount: Discount) => void;
  onDelete: (discountId: string) => void;
  onToggleStatus: (discountId: string, currentStatus: boolean) => void;
}

export default function DiscountTableRow({
  discount,
  isSuper,
  onEdit,
  onDelete,
  onToggleStatus,
}: DiscountTableRowProps) {
  const formatDiscountValue = (discount: Discount) => {
    if (discount.valueType === DiscountValueType.PERCENTAGE) {
      return `${discount.value}%`;
    }
    return `Rp ${discount.value.toLocaleString()}`;
  };

  return (
    <TableRow>
      <TableCell className="py-4">
        <div className="space-y-1">
          <div className="font-medium text-gray-900">{discount.name}</div>
          {discount.description && (
            <div className="line-clamp-2 text-sm text-gray-500">
              {discount.description}
            </div>
          )}
          {discount.minTransactionValue && (
            <Badge variant="outline" className="mt-1 text-xs text-blue-600">
              Min: Rp {discount.minTransactionValue.toLocaleString()}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge className={getDiscountTypeColor(discount.type)}>
          {getDiscountTypeLabel(discount.type)}
        </Badge>
      </TableCell>
      {isSuper && (
        <TableCell className="py-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900">
              {discount.store?.name || "Global"}
            </div>
            <div className="text-xs text-gray-500">
              {discount.store
                ? `${discount.store.city}, ${discount.store.province}`
                : "All Stores"}
            </div>
          </div>
        </TableCell>
      )}
      <TableCell className="py-4">
        <div className="space-y-1">
          {discount.products && discount.products.length > 0 ? (
            <>
              <Badge variant="secondary" className="text-xs">
                {discount.products.length} product
                {discount.products.length !== 1 ? "s" : ""}
              </Badge>
              <div className="line-clamp-2 text-xs text-gray-500">
                {discount.products
                  .slice(0, 2)
                  .map((p) => p.product.name)
                  .join(", ")}
                {discount.products.length > 2 &&
                  ` +${discount.products.length - 2} more`}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-400">No products</div>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="space-y-1">
          <div className="text-base font-semibold text-green-600">
            {formatDiscountValue(discount)}
          </div>
          {discount.maxDiscountAmount &&
            discount.valueType === DiscountValueType.PERCENTAGE && (
              <div className="text-xs text-gray-500">
                Max: Rp {discount.maxDiscountAmount.toLocaleString()}
              </div>
            )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {discount.currentUsageCount} used
          </div>
          {discount.totalUsageLimit && (
            <div className="text-xs text-gray-500">
              of {discount.totalUsageLimit}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1 text-gray-900">
            <Calendar className="h-3 w-3 text-gray-400" />
            {new Date(discount.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-500">
            to{" "}
            {new Date(discount.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Button
          size="sm"
          variant={discount.isActive ? "default" : "secondary"}
          onClick={() => onToggleStatus(discount.id, discount.isActive)}
          className={discount.isActive ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {discount.isActive ? "Active" : "Inactive"}
        </Button>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(discount)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(discount.id)}
            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
