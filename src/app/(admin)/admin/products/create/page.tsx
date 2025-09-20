"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProductCategory,
  CreateProductFormData,
} from "@/types/admin/product";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function CreateProductPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductFormData>({
    name: "",
    description: "",
    categoryId: "",
    price: 0,
    weight: 0,
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

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }
    loadCategories();
  }, [isAuthenticated, router, loadCategories]);

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
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (formData.weight <= 0) {
      toast.error("Weight must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const productData: CreateProductFormData = {
        ...formData,
        ...imageFiles,
      };

      await adminProductAPI.createProduct(admin.accessToken, productData);
      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      let errorMessage = "Failed to create product";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated()) {
    return null;
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
            <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
            <p className="text-gray-600">Add a new product to your inventory</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
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
                    value={formData.price}
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
                    value={formData.weight}
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
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
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
                            <div className="flex h-32 flex-col items-center justify-center text-gray-400 hover:text-gray-600">
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
                  Upload up to 4 images. Recommended size: 500x500px. Max size:
                  5MB each.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
