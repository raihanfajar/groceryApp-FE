"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProductCategory,
  UpdateCategoryFormData,
} from "@/types/admin/product";
import { FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import CategoryEditHeader from "@/components/admin/category/CategoryEditHeader";
import CategoryEditForm from "@/components/admin/category/CategoryEditForm";
import { getDefaultIcon } from "@/constants/categoryIcons";

export default function EditCategoryPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.slug as string;

  const [category, setCategory] = useState<AdminProductCategory | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCategory = useCallback(async () => {
    try {
      if (!admin?.accessToken || !categorySlug) return;

      const response = await adminCategoryAPI.getCategoryBySlug(
        admin.accessToken,
        categorySlug,
      );
      const categoryData = response.data.category;

      setCategory(categoryData);
    } catch (error) {
      console.error("Error loading category:", error);
      toast.error("Failed to load category");
      router.push("/admin/products?tab=categories");
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
      router.push("/admin/products?tab=categories");
      return;
    }

    if (categorySlug) {
      loadCategory();
    }
  }, [isAuthenticated, router, categorySlug, admin?.isSuper, loadCategory]);

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
            <Link href="/admin/products?tab=categories">
              <Button className="mt-4">Back to Categories</Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const initialFormData: UpdateCategoryFormData = {
    id: category.id,
    name: category.name,
    description: category.description || "",
    icon: category.icon || getDefaultIcon().id,
    isActive: category.isActive,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <CategoryEditHeader />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="h-5 w-5" />
              <span>Category Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryEditForm
              initialFormData={initialFormData}
              category={category}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
