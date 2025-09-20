"use client";

import { useEffect, useState } from "react";
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
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProduct,
  AdminProductCategory,
  ProductFilters,
} from "@/types/admin/product";
import { Plus, Search, Edit, Trash2, Eye, Package, Filter } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminProductsPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadProducts();
    loadCategories();
  }, [isAuthenticated, router, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      if (!admin?.accessToken) return;

      const response = await adminProductAPI.getProducts(
        admin.accessToken,
        filters,
      );
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      if (!admin?.accessToken) return;

      const response = await adminCategoryAPI.getCategories(admin.accessToken);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!admin?.accessToken) return;

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await adminProductAPI.deleteProduct(admin.accessToken, id);
      toast.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId === "all" ? undefined : categoryId,
      page: 1,
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
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
              Product Management
            </h1>
            <p className="text-gray-600">
              {admin.isSuper
                ? "Manage products across all stores"
                : `Manage products for ${admin.store?.name}`}
            </p>
          </div>
          {admin.isSuper && (
            <Link href="/admin/products/create">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filters.categoryId || "all"}
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories &&
                    Array.isArray(categories) &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {admin.isSuper && (
                <Select
                  value={filters.storeId || "all"}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      storeId: value === "all" ? undefined : value,
                      page: 1,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {/* We'll need to add store options here */}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-600">No products found</p>
              {admin.isSuper && (
                <Link href="/admin/products/create">
                  <Button className="mt-4">Create your first product</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  {product.picture1 ? (
                    <img
                      src={product.picture1}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="truncate font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.weight}g
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Category: {product.category.name}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Link
                      href={`/admin/products/${product.id}`}
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
                          href={`/admin/products/${product.id}/edit`}
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
                          onClick={() => handleDeleteProduct(product.id)}
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: pagination.page - 1 }))
              }
            >
              Previous
            </Button>

            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: pagination.page + 1 }))
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
