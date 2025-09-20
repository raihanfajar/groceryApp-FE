"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { CreateCategoryFormData } from "@/types/admin/product";
import { ArrowLeft, FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function CreateCategoryPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryFormData>({
    name: "",
    description: "",
  });

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
  }, [isAuthenticated, router, admin?.isSuper]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin?.accessToken) {
      toast.error("Authentication required");
      return;
    }

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
      };

      await adminCategoryAPI.createCategory(admin.accessToken, categoryData);
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

  if (!isAuthenticated() || !admin?.isSuper) {
    return null;
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
            <h1 className="text-2xl font-bold text-gray-900">
              Create Category
            </h1>
            <p className="text-gray-600">Add a new product category</p>
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
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Preview
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Name:{" "}
                    </span>
                    <span className="text-sm text-gray-900">
                      {formData.name || "Category name will appear here"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Slug:{" "}
                    </span>
                    <span className="font-mono text-sm text-gray-700">
                      {formData.name
                        ? formData.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")
                        : "category-slug"}
                    </span>
                  </div>
                  {formData.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Description:{" "}
                      </span>
                      <span className="text-sm text-gray-900">
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
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
