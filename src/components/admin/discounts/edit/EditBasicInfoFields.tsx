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
import { DiscountValueType } from "@/types/discount";

interface EditBasicInfoFieldsProps {
  name: string;
  description: string;
  discountType: string;
  valueType: DiscountValueType;
  value: number;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onValueTypeChange: (value: DiscountValueType) => void;
  onValueChange: (value: number) => void;
}

export default function EditBasicInfoFields({
  name,
  description,
  discountType,
  valueType,
  value,
  onNameChange,
  onDescriptionChange,
  onValueTypeChange,
  onValueChange,
}: EditBasicInfoFieldsProps) {
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
          <Label>Discount Type</Label>
          <Input value={discountType} disabled className="bg-gray-100" />
          <p className="text-xs text-gray-500">
            Discount type cannot be changed
          </p>
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
            value={value || ""}
            onChange={(e) => onValueChange(parseInt(e.target.value) || 0)}
            min="0"
            max={valueType === DiscountValueType.PERCENTAGE ? "100" : undefined}
            required
          />
        </div>
      </div>
    </>
  );
}
