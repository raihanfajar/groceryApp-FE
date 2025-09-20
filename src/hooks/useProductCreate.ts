import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { adminProductAPI } from "@/services/admin/productAPI";
import { CreateProductFormData } from "@/types/admin/product";
import { toast } from "react-toastify";

export const useProductCreate = () => {
  const { admin } = useAdminAuthStore();
  const router = useRouter();
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" || name === "weight" ? Number(value) : value,
      }));
    },
    [],
  );

  const handleCategoryChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  }, []);

  const handleImageChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      imageKey: keyof typeof imageFiles,
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
    },
    [],
  );

  const removeImage = useCallback((imageKey: keyof typeof imageFiles) => {
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
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return false;
    }
    if (formData.price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    if (formData.weight <= 0) {
      toast.error("Weight must be greater than 0");
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!admin?.accessToken) {
        toast.error("Authentication required");
        return;
      }

      if (!validateForm()) {
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
    },
    [admin?.accessToken, formData, imageFiles, validateForm, router],
  );

  return {
    formData,
    imageFiles,
    imagePreviews,
    loading,
    handleInputChange,
    handleCategoryChange,
    handleImageChange,
    removeImage,
    handleSubmit,
  };
};
