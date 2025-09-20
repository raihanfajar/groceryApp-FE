"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProductCategory,
  UpdateCategoryFormData,
} from "@/types/admin/product";
import { toast } from "react-toastify";
import Link from "next/link";
import CategoryCurrentInfo from "./CategoryCurrentInfo";
import CategoryPreview from "./CategoryPreview";
import CategoryIconSelector from "./CategoryIconSelector";
import { getDefaultIcon } from "@/constants/categoryIcons";

interface CategoryEditFormProps {
  initialFormData: UpdateCategoryFormData;
  category: AdminProductCategory;
}

export default function CategoryEditForm({
  initialFormData,
  category,
}: CategoryEditFormProps) {
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] =
    useState<UpdateCategoryFormData>(initialFormData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleIconSelect = (iconId: string) => {
    setFormData((prev) => ({ ...prev, icon: iconId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    // Basic validation
    if (!formData.name?.trim()) {
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
      setSaving(true);

      const updateData: Partial<UpdateCategoryFormData> = {
        name: formData.name?.trim(),
        description: formData.description?.trim() || undefined,
        icon: formData.icon,
        isActive: formData.isActive,
      };

      await adminCategoryAPI.updateCategory(
        admin.accessToken,
        formData.id,
        updateData,
      );
      toast.success("Category updated successfully!");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      let errorMessage = "Failed to update category";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Icon */}
      <CategoryIconSelector
        selectedIconId={formData.icon || getDefaultIcon().id}
        onIconSelect={handleIconSelect}
        required
      />

      {/* Category Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="Enter category name"
          required
          maxLength={50}
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          {(formData.name || "").length}/50 characters
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
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

      {/* Active Status */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive || false}
          onCheckedChange={handleActiveChange}
        />
        <Label htmlFor="isActive">Category is active</Label>
        <p className="text-sm text-gray-500">
          Inactive categories won&apos;t be visible to customers
        </p>
      </div>

      {/* Current Info */}
      <CategoryCurrentInfo category={category} />

      {/* Preview */}
      <CategoryPreview formData={formData} />

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Link href="/admin/categories">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}
