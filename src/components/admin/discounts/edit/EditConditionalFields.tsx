import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscountValueType } from "@/types/discount";

interface EditConditionalFieldsProps {
  valueType: DiscountValueType;
  maxDiscountAmount?: number;
  minTransactionValue?: number | null;
  onMaxDiscountAmountChange: (value: number | undefined) => void;
  onMinTransactionValueChange: (value: number | undefined) => void;
}

export default function EditConditionalFields({
  valueType,
  maxDiscountAmount,
  minTransactionValue,
  onMaxDiscountAmountChange,
  onMinTransactionValueChange,
}: EditConditionalFieldsProps) {
  return (
    <>
      {valueType === DiscountValueType.PERCENTAGE && (
        <div className="space-y-2">
          <Label htmlFor="maxDiscountAmount">
            Maximum Discount Amount (Rp)
          </Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            value={maxDiscountAmount || ""}
            onChange={(e) =>
              onMaxDiscountAmountChange(parseInt(e.target.value) || undefined)
            }
            min="0"
          />
        </div>
      )}

      {minTransactionValue !== null && (
        <div className="space-y-2">
          <Label htmlFor="minTransactionValue">
            Minimum Transaction Value (Rp)
          </Label>
          <Input
            id="minTransactionValue"
            type="number"
            value={minTransactionValue || ""}
            onChange={(e) =>
              onMinTransactionValueChange(parseInt(e.target.value) || undefined)
            }
            min="0"
          />
        </div>
      )}
    </>
  );
}
