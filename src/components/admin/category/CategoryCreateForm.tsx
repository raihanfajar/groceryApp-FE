import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { CreateCategoryFormData } from "@/types/admin/product";
import { FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import CategoryCreatePreview from "./CategoryCreatePreview";
import CategoryIconSelector from "./CategoryIconSelector";
import { getDefaultIcon } from "@/constants/categoryIcons";

interface CategoryCreateFormProps {
  accessToken: string;
}

export default function CategoryCreateForm({
  accessToken,
}: CategoryCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    name: "",
    description: "",
    icon: getDefaultIcon().id,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIconSelect = (iconId: string) => {
    setFormData((prev) => ({
      ...prev,
      icon: iconId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("Category name must be at least 2 characters");
      return;
    }

    if (formData.name.trim().length > 50) {
      toast.error("Category name must not exceed 50 characters");
      return;
    }

    try {
      setLoading(true);

      const categoryData: CreateCategoryFormData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        icon: formData.icon,
      };

      await adminCategoryAPI.createCategory(accessToken, categoryData);
      toast.success("Category created successfully!");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      let errorMessage = "Failed to create category";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FolderTree className="h-5 w-5" />
          <span>Category Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Icon */}
          <CategoryIconSelector
            selectedIconId={formData.icon}
            onIconSelect={handleIconSelect}
            required
          />

          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              required
              maxLength={50}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              {formData.name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description"
              rows={4}
              maxLength={200}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              {(formData.description || "").length}/200 characters
            </p>
          </div>

          {/* Preview */}
          <CategoryCreatePreview formData={formData} />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/categories">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
