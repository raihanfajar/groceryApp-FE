"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory } from "@/types/admin/product";
import {
  ArrowLeft,
  Edit,
  FolderTree,
  Package,
  Calendar,
  Hash,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

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
      router.push("/admin-login");
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/categories">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h1>
              <p className="text-gray-600">Category Details</p>
            </div>
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {admin?.isSuper && (
            <Link href={`/admin/categories/${category.slug}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </Button>
            </Link>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderTree className="h-5 w-5" />
                <span>Category Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-lg font-medium">{category.name}</p>
              </div>

              {category.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="text-gray-900">{category.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Slug
                </label>
                <p className="font-mono text-sm text-gray-700">
                  {category.slug}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics & Metadata */}
          <div className="space-y-6">
            {/* Product Count */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {category._count?.products || 0}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Products in this category
                  </p>
                  {category._count?.products &&
                    category._count.products > 0 && (
                      <Link href={`/admin/products?categoryId=${category.id}`}>
                        <Button variant="outline" size="sm" className="mt-3">
                          View Products
                        </Button>
                      </Link>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Category ID
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm text-gray-700">
                      {category.id}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created
                  </label>
                  <p className="text-sm text-gray-700">
                    {new Date(category.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-700">
                    {new Date(category.updatedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        {!category.isActive && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <p className="text-sm text-orange-800">
                  This category is currently inactive and won&apos;t be visible
                  to customers. Products in this category may also be affected.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {category._count?.products === 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <p className="text-sm text-blue-800">
                  This category doesn&apos;t have any products yet.
                  {admin?.isSuper && (
                    <>
                      {" "}
                      You can{" "}
                      <Link
                        href="/admin/products/create"
                        className="font-medium underline"
                      >
                        create a new product
                      </Link>{" "}
                      and assign it to this category.
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
