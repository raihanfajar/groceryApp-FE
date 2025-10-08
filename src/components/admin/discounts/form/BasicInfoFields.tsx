import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiscountType, DiscountValueType } from "@/types/discount";

interface BasicInfoFieldsProps {
  name: string;
  description: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  maxDiscountAmount?: number;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: DiscountType) => void;
  onValueTypeChange: (value: DiscountValueType) => void;
  onValueChange: (value: number) => void;
  onMaxDiscountAmountChange: (value?: number) => void;
}

export default function BasicInfoFields({
  name,
  description,
  type,
  valueType,
  value,
  maxDiscountAmount,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onValueTypeChange,
  onValueChange,
  onMaxDiscountAmountChange,
}: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Discount Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Discount Type *</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DiscountType.MANUAL}>Manual</SelectItem>
              <SelectItem value={DiscountType.MINIMUM_PURCHASE}>
                Minimum Purchase
              </SelectItem>
              <SelectItem value={DiscountType.BOGO}>
                Buy One Get One (BOGO)
              </SelectItem>
              <SelectItem value={DiscountType.REGULAR}>Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valueType">Value Type *</Label>
          <Select value={valueType} onValueChange={onValueTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select value type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DiscountValueType.PERCENTAGE}>
                Percentage (%)
              </SelectItem>
              <SelectItem value={DiscountValueType.NOMINAL}>
                Fixed Amount (Rp)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            {valueType === DiscountValueType.PERCENTAGE
              ? "Percentage"
              : "Amount"}{" "}
            *
          </Label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
            min="0"
            max={valueType === DiscountValueType.PERCENTAGE ? "100" : undefined}
            required
          />
        </div>
      </div>

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
    </>
  );
}
