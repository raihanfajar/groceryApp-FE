"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminCategoryAPI } from "@/services/admin/productAPI";
import { AdminProductCategory, CategoryFilters } from "@/types/admin/product";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FolderTree,
  Package,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(
        admin.accessToken,
        filters,
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, filters]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadCategories();
  }, [isAuthenticated, router, loadCategories]);

  const handleDeleteCategory = async (id: string) => {
    if (!admin?.accessToken) return;

    if (
      !confirm(
        "Are you sure you want to delete this category? This action will affect all products in this category.",
      )
    )
      return;

    try {
      await adminCategoryAPI.deleteCategory(admin.accessToken, id);
      toast.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
    }));
  };

  const handleActiveFilter = (isActive: string) => {
    setFilters((prev) => ({
      ...prev,
      isActive: isActive === "all" ? undefined : isActive === "true",
    }));
  };

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-600">
              {admin.isSuper
                ? "Manage product categories across all stores"
                : `View categories for ${admin.store?.name}`}
            </p>
          </div>
          {admin.isSuper && (
            <Link href="/admin/categories/create">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={
                  filters.isActive === undefined
                    ? "all"
                    : filters.isActive.toString()
                }
                onValueChange={handleActiveFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">No categories found</p>
              {admin.isSuper && (
                <Link href="/admin/categories/create">
                  <Button className="mt-4">Create your first category</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FolderTree className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                      </div>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {category.description && (
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{category._count?.products || 0} products</span>
                      </div>
                      <span className="font-mono text-xs">{category.slug}</span>
                    </div>

                    <div className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(category.createdAt).toLocaleDateString("id-ID")}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </Link>

                    {admin.isSuper && (
                      <>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full">
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={
                            !!(
                              category._count?.products &&
                              category._count.products > 0
                            )
                          }
                          title={
                            category._count?.products &&
                            category._count.products > 0
                              ? "Cannot delete category with products"
                              : "Delete category"
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
