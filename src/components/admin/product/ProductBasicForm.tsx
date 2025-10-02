import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AdminProductCategory,
  CreateProductFormData,
} from "@/types/admin/product";

interface ProductBasicFormProps {
  formData: CreateProductFormData;
  categories: AdminProductCategory[];
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ProductBasicForm: React.FC<ProductBasicFormProps> = ({
  formData,
  categories,
  onInputChange,
  onCategoryChange,
  onDescriptionChange,
}) => {
  return (
    <>
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={formData.categoryId}
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
            value={formData.price}
            onChange={onInputChange}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (grams/ml) *</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            value={formData.weight}
            onChange={onInputChange}
            placeholder="0"
            required
          />
        </div>
      </div>

      <RichTextEditor
        label="Product Description"
        value={formData.description}
        onChange={onDescriptionChange}
        placeholder="Enter a detailed product description..."
        required
        className="col-span-full"
      />
    </>
  );
};

export default ProductBasicForm;
