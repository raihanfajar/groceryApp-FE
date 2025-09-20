"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProductCategory,
  UpdateCategoryFormData,
} from "@/types/admin/product";
import { ArrowLeft, FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function EditCategoryPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.slug as string;

  const [category, setCategory] = useState<AdminProductCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateCategoryFormData>({
    id: "", // Will be set when category loads
    name: "",
    description: "",
    isActive: true,
  });

  const loadCategory = useCallback(async () => {
    try {
      if (!admin?.accessToken || !categorySlug) return;

      const response = await adminCategoryAPI.getCategoryBySlug(
        admin.accessToken,
        categorySlug,
      );
      const categoryData = response.data.category; // Fix: access nested category data

      setCategory(categoryData);
      setFormData({
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description || "",
        isActive: categoryData.isActive,
      });
    } catch (error) {
      console.error("Error loading category:", error);
      toast.error("Failed to load category");
      router.push("/admin/categories");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, categorySlug, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }

    if (!admin?.isSuper) {
      toast.error("Access denied. Super admin privileges required.");
      router.push("/admin/categories");
      return;
    }

    if (categorySlug) {
      loadCategory();
    }
  }, [isAuthenticated, router, categorySlug, admin?.isSuper, loadCategory]);

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
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        isActive: formData.isActive,
      };

      await adminCategoryAPI.updateCategory(
        admin.accessToken,
        formData.id, // Use the category ID from the loaded category data
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

  if (!isAuthenticated() || !admin?.isSuper) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <FolderTree className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Loading category...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <FolderTree className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Category not found</p>
            <Link href="/admin/categories">
              <Button className="mt-4">Back to Categories</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600">Update category information</p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="h-5 w-5" />
              <span>Category Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Current Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Created:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {new Date(category.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Last Updated:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {new Date(category.updatedAt).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Slug:{" "}
                    </span>
                    <span className="font-mono text-sm text-gray-700">
                      {category.slug}
                    </span>
                  </div>
                  {category._count && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Products:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
                        {category._count.products} products
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-blue-700">
                  Preview Changes
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Name:{" "}
                    </span>
                    <span className="text-sm text-blue-900">
                      {formData.name || "Category name will appear here"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Slug:{" "}
                    </span>
                    <span className="font-mono text-sm text-blue-700">
                      {formData.name
                        ? formData.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")
                        : "category-slug"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-600">
                      Status:{" "}
                    </span>
                    <span
                      className={`text-sm ${formData.isActive ? "text-green-700" : "text-red-700"}`}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {formData.description && (
                    <div>
                      <span className="text-sm font-medium text-blue-600">
                        Description:{" "}
                      </span>
                      <span className="text-sm text-blue-900">
                        {formData.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>

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
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
