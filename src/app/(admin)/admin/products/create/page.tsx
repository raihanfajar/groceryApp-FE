"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory } from "@/types/admin/product";
import { toast } from "react-toastify";
import ProductCreateHeader from "@/components/admin/product/ProductCreateHeader";
import ProductBasicForm from "@/components/admin/product/ProductBasicForm";
import ProductImageUpload from "@/components/admin/product/ProductImageUpload";
import ProductCreateActions from "@/components/admin/product/ProductCreateActions";
import { useProductCreate } from "@/hooks/useProductCreate";

export default function CreateProductPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);

  const {
    formData,
    imagePreviews,
    loading,
    handleInputChange,
    handleCategoryChange,
    handleDescriptionChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  } = useProductCreate();

  const loadCategories = useCallback(async () => {
    try {
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(admin.accessToken);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  }, [admin?.accessToken]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadCategories();
  }, [isAuthenticated, router, loadCategories]);

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProductCreateHeader />

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <ProductBasicForm
                formData={formData}
                categories={categories}
                onInputChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onDescriptionChange={handleDescriptionChange}
              />

              <ProductImageUpload
                imagePreviews={imagePreviews}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
              />

              <ProductCreateActions loading={loading} />
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
