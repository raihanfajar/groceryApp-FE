"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useProductEdit } from "@/hooks/useProductEdit";
import ProductEditHeader from "@/components/admin/product/ProductEditHeader";
import ProductEditForm from "@/components/admin/product/ProductEditForm";
import ProductImageUpload from "@/components/admin/product/ProductImageUpload";
import ProductFormActions from "@/components/admin/product/ProductFormActions";

export default function EditProductPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const productSlug = params.slug as string;

  const {
    product,
    categories,
    loading,
    saving,
    formData,
    imagePreviews,
    loadCategories,
    loadProduct,
    handleInputChange,
    handleCategoryChange,
    handleDescriptionChange,
    handleActiveChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  } = useProductEdit(productSlug, admin?.accessToken || "");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
      return;
    }

    if (!admin?.isSuper) {
      toast.error("Access denied. Super admin privileges required.");
      router.push("/admin/products");
      return;
    }

    if (productSlug) {
      loadProduct();
      loadCategories();
    }
  }, [
    isAuthenticated,
    router,
    productSlug,
    admin?.isSuper,
    loadProduct,
    loadCategories,
  ]);

  if (!isAuthenticated() || !admin?.isSuper) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">Product not found</p>
            <Link href="/admin/products">
              <Button className="mt-4">Back to Products</Button>
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
        <ProductEditHeader />

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <ProductEditForm
                formData={formData}
                categories={categories}
                loading={loading}
                onChange={handleInputChange}
                onCategoryChange={handleCategoryChange}
                onDescriptionChange={handleDescriptionChange}
                onActiveChange={handleActiveChange}
              />

              {/* Image Upload */}
              <ProductImageUpload
                imagePreviews={imagePreviews}
                onImageChange={handleImageChange}
                onRemoveImage={removeImage}
              />

              {/* Submit Button */}
              <ProductFormActions saving={saving} />
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
