"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminProductAPI } from "@/services/admin/productAPI";
import { AdminProduct } from "@/types/admin/product";
import { ArrowLeft, Edit, Package, Store } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function ProductViewPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const productSlug = params.slug as string;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    try {
      if (!admin?.accessToken || !productSlug) return;

      const response = await adminProductAPI.getProductBySlug(
        admin.accessToken,
        productSlug,
      );
      setProduct(response.data.product); // Fix: access nested product data
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [admin?.accessToken, productSlug, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    if (productSlug) {
      loadProduct();
    }
  }, [isAuthenticated, router, productSlug, loadProduct]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!isAuthenticated()) {
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-gray-600">{product.category.name}</p>
            </div>
            <Badge variant={product.isActive ? "default" : "secondary"}>
              {product.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {admin?.isSuper && (
            <Link href={`/admin/products/${product.slug}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  product.picture1,
                  product.picture2,
                  product.picture3,
                  product.picture4,
                ]
                  .filter(Boolean)
                  .map((picture, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={picture!}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ))}
                {[
                  product.picture1,
                  product.picture2,
                  product.picture3,
                  product.picture4,
                ].filter(Boolean).length === 0 && (
                  <div className="col-span-2 flex h-48 items-center justify-center rounded-lg bg-gray-100">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Name
                  </label>
                  <p className="text-lg font-medium">{product.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <p className="text-gray-900">{product.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Price
                    </label>
                    <p className="text-xl font-bold text-green-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Weight
                    </label>
                    <p className="text-lg font-medium">{product.weight}g</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Category
                  </label>
                  <p className="text-lg font-medium">{product.category.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Slug
                  </label>
                  <p className="font-mono text-sm text-gray-700">
                    {product.slug}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created
                    </label>
                    <p className="text-sm text-gray-700">
                      {new Date(product.createdAt).toLocaleDateString("id-ID", {
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
                      {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Information */}
            {product.storeStock && product.storeStock.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="mr-2 h-5 w-5" />
                    Store Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.storeStock.map((stock) => (
                      <div
                        key={stock.storeId}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div>
                          <h4 className="font-medium">{stock.store.name}</h4>
                          <p className="text-sm text-gray-600">
                            Min Stock: {stock.minStock}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {stock.stock} units
                          </p>
                          <Badge
                            variant={
                              stock.stock > stock.minStock
                                ? "default"
                                : stock.stock > 0
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {stock.stock > stock.minStock
                              ? "In Stock"
                              : stock.stock > 0
                                ? "Low Stock"
                                : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {product.totalStock !== undefined && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Stock:</span>
                          <span className="text-lg font-bold">
                            {product.totalStock} units
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
