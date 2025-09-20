import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminProductCategory,
  UpdateProductFormData,
} from "@/types/admin/product";

interface ProductEditFormProps {
  formData: UpdateProductFormData;
  categories: AdminProductCategory[];
  loading: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCategoryChange: (value: string) => void;
  onActiveChange: (checked: boolean) => void;
}

export default function ProductEditForm({
  formData,
  categories,
  loading,
  onChange,
  onCategoryChange,
  onActiveChange,
}: ProductEditFormProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200"></div>
              <div className="h-10 rounded bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-gray-200"></div>
              <div className="h-10 rounded bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-gray-200"></div>
              <div className="h-10 rounded bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-gray-200"></div>
              <div className="h-10 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-24 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name ?? ""}
            onChange={onChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={formData.categoryId ?? ""}
            onValueChange={onCategoryChange}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories &&
                Array.isArray(categories) &&
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (IDR) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1000"
            value={formData.price ?? ""}
            onChange={onChange}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (grams) *</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            value={formData.weight ?? ""}
            onChange={onChange}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description ?? ""}
          onChange={onChange}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive || false}
          onCheckedChange={onActiveChange}
        />
        <Label htmlFor="isActive">Product is active</Label>
      </div>
    </div>
  );
}
