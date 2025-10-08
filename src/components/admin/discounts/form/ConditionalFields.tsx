import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DiscountType } from "@/types/discount";

interface ConditionalFieldsProps {
  type: DiscountType;
  minTransactionValue?: number;
  buyQuantity?: number;
  getQuantity?: number;
  maxBogoSets?: number;
  applyToSameProduct?: boolean;
  onMinTransactionValueChange: (value?: number) => void;
  onBuyQuantityChange: (value?: number) => void;
  onGetQuantityChange: (value?: number) => void;
  onMaxBogoSetsChange: (value?: number) => void;
  onApplyToSameProductChange: (value: boolean) => void;
}

export default function ConditionalFields({
  type,
  minTransactionValue,
  buyQuantity,
  getQuantity,
  maxBogoSets,
  applyToSameProduct,
  onMinTransactionValueChange,
  onBuyQuantityChange,
  onGetQuantityChange,
  onMaxBogoSetsChange,
  onApplyToSameProductChange,
}: ConditionalFieldsProps) {
  if (type === DiscountType.MINIMUM_PURCHASE) {
    return (
      <div className="space-y-2">
        <Label htmlFor="minTransactionValue">
          Minimum Transaction Value (Rp) *
        </Label>
        <Input
          id="minTransactionValue"
          type="number"
          value={minTransactionValue || ""}
          onChange={(e) =>
            onMinTransactionValueChange(parseInt(e.target.value) || undefined)
          }
          min="0"
          required
        />
      </div>
    );
  }

  if (type === DiscountType.BOGO) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="buyQuantity">Buy Quantity *</Label>
            <Input
              id="buyQuantity"
              type="number"
              value={buyQuantity || ""}
              onChange={(e) =>
                onBuyQuantityChange(parseInt(e.target.value) || undefined)
              }
              min="1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="getQuantity">Get Quantity *</Label>
            <Input
              id="getQuantity"
              type="number"
              value={getQuantity || ""}
              onChange={(e) =>
                onGetQuantityChange(parseInt(e.target.value) || undefined)
              }
              min="1"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxBogoSets">Max BOGO Sets Per Transaction</Label>
            <Input
              id="maxBogoSets"
              type="number"
              value={maxBogoSets || ""}
              onChange={(e) =>
                onMaxBogoSetsChange(parseInt(e.target.value) || undefined)
              }
              min="1"
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="applyToSameProduct"
              checked={applyToSameProduct ?? true}
              onCheckedChange={(checked) =>
                onApplyToSameProductChange(checked as boolean)
              }
            />
            <Label htmlFor="applyToSameProduct">Apply to same product</Label>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
