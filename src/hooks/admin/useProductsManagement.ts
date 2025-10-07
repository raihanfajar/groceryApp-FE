import { useState } from "react";
import { useProductListing } from "@/hooks/useProductListing";

export function useProductsManagement() {
  const [productView, setProductView] = useState<"grid" | "list">("grid");

  const {
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    admin,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  } = useProductListing();

  return {
    products,
    categories,
    stores,
    loading,
    filters,
    pagination,
    admin,
    productView,
    setProductView,
    handleDeleteProduct,
    handleSearch,
    handleCategoryFilter,
    handleStoreFilter,
    handlePageChange,
  };
}
