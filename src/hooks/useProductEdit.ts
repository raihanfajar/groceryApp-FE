import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminProductAPI, adminCategoryAPI } from "@/services/admin/productAPI";
import {
  AdminProduct,
  AdminProductCategory,
  UpdateProductFormData,
} from "@/types/admin/product";
import { toast } from "react-toastify";

export function useProductEdit(productSlug: string, accessToken: string) {
  const router = useRouter();

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [categories, setCategories] = useState<AdminProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProductFormData>({
    id: "",
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
      if (!accessToken) return;

      const response = await adminCategoryAPI.getCategories(accessToken);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Failed to load categories");
    }
  }, [accessToken]);

  const loadProduct = useCallback(async () => {
    try {
      if (!accessToken || !productSlug) return;

      const response = await adminProductAPI.getProductBySlug(
        accessToken,
        productSlug,
      );
      const productData = response.data.product;

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
  }, [accessToken, productSlug, router]);

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

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageKey: "picture1" | "picture2" | "picture3" | "picture4",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const removeImage = (
    imageKey: "picture1" | "picture2" | "picture3" | "picture4",
  ) => {
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

    if (!accessToken) {
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
        // Ensure isActive is a boolean, not a string
        isActive: Boolean(formData.isActive),
        ...imageFiles,
      };

      await adminProductAPI.updateProduct(accessToken, formData.id, updateData);
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

  return {
    product,
    categories,
    loading,
    saving,
    formData,
    imageFiles,
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
  };
}
