"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { adminProductAPI } from "@/services/admin/productAPI";
import { AdminProduct } from "@/types/admin/product";
import { Package } from "lucide-react";
import { toast } from "react-toastify";
import ProductViewHeader from "@/components/admin/product/ProductViewHeader";
import ProductImageGallery from "@/components/admin/product/ProductImageGallery";
import ProductDetailsCard from "@/components/admin/product/ProductDetailsCard";
import ProductStockCard from "@/components/admin/product/ProductStockCard";

export default function ProductViewPage() {
  const router = useRouter();
  const params = useParams();
  const { admin, isAuthenticated } = useAdminAuthStore();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const slug = params?.slug as string;

  const fetchProduct = useCallback(async () => {
    if (!slug || !admin?.accessToken) return;

    setLoading(true);
    try {
      const response = await adminProductAPI.getProductBySlug(
        admin.accessToken,
        slug,
      );
      setProduct(response.data.product);
    } catch (error) {
      toast.error("Error fetching product");
      console.error("Error fetching product:", error);
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [slug, admin?.accessToken, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    fetchProduct();
  }, [isAuthenticated, fetchProduct, router]);

  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <Package className="mb-4 h-16 w-16 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Product Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/admin/products")}>
            Back to Products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <ProductViewHeader
          product={product}
          isSuper={admin?.isSuper || false}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <ProductImageGallery product={product} />
            <ProductDetailsCard product={product} />
          </div>

          <div>
            <ProductStockCard product={product} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
