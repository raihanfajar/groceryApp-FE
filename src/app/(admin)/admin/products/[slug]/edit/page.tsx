"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  UpdateProductFormData,
} from "@/types/admin/product";
import { ArrowLeft, Upload, X, Package } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function EditProductPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();
  const params = useParams();
  const productSlug = params.slug as string;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProductFormData>({
    id: "", // Will be set when product loads
    name: undefined,
    description: undefined,
    categoryId: undefined,
    price: undefined,
    weight: undefined,
    isActive: true,
  });
  const [imageFiles, setImageFiles] = useState<{
    picture1?: File;
    picture2?: File;
    picture3?: File;
    picture4?: File;
  }>({});
  const [imagePreviews, setImagePreviews] = useState<{
    picture1?: string;
    picture2?: string;
    picture3?: string;
    picture4?: string;
  }>({});

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

  const loadProduct = useCallback(async () => {
    try {
      if (!admin?.accessToken || !productSlug) return;

      const response = await adminProductAPI.getProductBySlug(
        admin.accessToken,
        productSlug,
      );
      const productData = response.data.product; // Fix: access nested product data

      setProduct(productData);
      const newFormData = {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        categoryId: productData.categoryId,
        price: productData.price,
        weight: productData.weight,
        isActive: productData.isActive,
      };

      setFormData(newFormData);

      // Set existing image previews
      setImagePreviews({
        picture1: productData.picture1 || undefined,
        picture2: productData.picture2 || undefined,
        picture3: productData.picture3 || undefined,
        picture4: productData.picture4 || undefined,
      });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "weight" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: keyof typeof imageFiles,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setImageFiles((prev) => ({ ...prev, [imageKey]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageKey]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageKey: keyof typeof imageFiles) => {
    setImageFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[imageKey];
      return newFiles;
    });
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[imageKey];
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin?.accessToken) {
      toast.error("Authentication required");
      return;
    }

    // Basic validation
    if (!formData.name?.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (!formData.weight || formData.weight <= 0) {
      toast.error("Weight must be greater than 0");
      return;
    }

    try {
      setSaving(true);

      const updateData: Partial<UpdateProductFormData> = {
        ...formData,
        ...imageFiles,
      };

      await adminProductAPI.updateProduct(
        admin.accessToken,
        formData.id, // Use the product ID from the loaded product data
        updateData,
      );
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      let errorMessage = "Failed to update product";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

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
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="h-4 w-24 rounded bg-gray-200"></div>
                      <div className="h-10 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                      <div className="h-10 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-gray-200"></div>
                      <div className="h-10 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                      <div className="h-10 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                    <div className="h-24 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Category *</Label>
                    <Select
                      value={formData.categoryId ?? ""}
                      onValueChange={handleCategoryChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories &&
                          Array.isArray(categories) &&
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (IDR) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.price ?? ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (grams) *</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      value={formData.weight ?? ""}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description ?? ""}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive || false}
                    onCheckedChange={handleActiveChange}
                  />
                  <Label htmlFor="isActive">Product is active</Label>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>Product Images</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {(
                      ["picture1", "picture2", "picture3", "picture4"] as const
                    ).map((imageKey, index) => (
                      <div key={imageKey} className="space-y-2">
                        <Label className="text-sm text-gray-600">
                          Image {index + 1}
                          {index === 0 && " (Main)"}
                        </Label>
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                          {imagePreviews[imageKey] ? (
                            <div className="relative">
                              <Image
                                src={imagePreviews[imageKey]!}
                                alt={`Preview ${index + 1}`}
                                width={150}
                                height={150}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(imageKey)}
                                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="block cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, imageKey)}
                                className="hidden"
                              />
                              <div className="flex h-32 flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-400 hover:text-gray-600">
                                <Upload className="mb-2 h-8 w-8" />
                                <span className="text-sm">Upload Image</span>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload up to 4 images. Recommended size: 500x500px. Max
                    size: 5MB each. Leave empty to keep existing images.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Link href="/admin/products">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Updating..." : "Update Product"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
