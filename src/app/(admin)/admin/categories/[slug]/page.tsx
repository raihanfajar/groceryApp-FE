"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory } from "@/types/admin/product";
import { FolderTree } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import CategoryViewHeader from "@/components/admin/category/CategoryViewHeader";
import CategoryInfoCard from "@/components/admin/category/CategoryInfoCard";
import CategoryStatsCard from "@/components/admin/category/CategoryStatsCard";
import CategoryMetadataCard from "@/components/admin/category/CategoryMetadataCard";
import CategoryAlerts from "@/components/admin/category/CategoryAlerts";

export default function CategoryViewPage() {
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
      setCategory(response.data.category); // Fix: access nested category data
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
      router.push("/");
      return;
    }
    if (categorySlug) {
      loadCategory();
    }
  }, [isAuthenticated, router, categorySlug, loadCategory]);

  if (!isAuthenticated()) {
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
        <CategoryViewHeader
          category={category}
          isSuper={admin?.isSuper || false}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Information */}
          <CategoryInfoCard category={category} />

          {/* Statistics & Metadata */}
          <div className="space-y-6">
            <CategoryStatsCard category={category} />
            <CategoryMetadataCard category={category} />
          </div>
        </div>

        {/* Alerts */}
        <CategoryAlerts category={category} isSuper={admin?.isSuper || false} />
      </div>
    </AdminLayout>
  );
}
