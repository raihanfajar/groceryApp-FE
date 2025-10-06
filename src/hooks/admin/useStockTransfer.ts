import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { adminProductAPI } from "@/services/admin/productAPI";
import { Store, StockTransferRequest } from "@/types/admin/inventory";
import { AdminProduct } from "@/types/admin/product";

export function useStockTransfer(accessToken: string | undefined) {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [fromStoreId, setFromStoreId] = useState("");
  const [toStoreId, setToStoreId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Selected product details
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [availableStock, setAvailableStock] = useState<number>(0);

  // Load stores
  const loadStores = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoadingStores(true);
      const response = await adminInventoryAPI.getStores(accessToken);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
      toast.error("Failed to load stores");
    } finally {
      setLoadingStores(false);
    }
  }, [accessToken]);

  // Load products
  const loadProducts = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoadingProducts(true);
      const response = await adminProductAPI.getProducts(accessToken, {
        page: 1,
        limit: 100,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  }, [accessToken]);

  // Load stores and products on mount
  useEffect(() => {
    loadStores();
    loadProducts();
  }, [loadStores, loadProducts]);

  // Update available stock when product or from store changes
  useEffect(() => {
    if (productId && fromStoreId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        const storeStock = product.storeStock?.find(
          (s) => s.storeId === fromStoreId,
        );
        setAvailableStock(storeStock?.stock || 0);
      }
    } else {
      setSelectedProduct(null);
      setAvailableStock(0);
    }
  }, [productId, fromStoreId, products]);

  const handleSubmit = async () => {
    if (!accessToken) return;

    // Validation
    if (!fromStoreId || !toStoreId || !productId || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (fromStoreId === toStoreId) {
      toast.error("Source and destination stores must be different");
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (quantityNum > availableStock) {
      toast.error(
        `Insufficient stock. Only ${availableStock} units available at source store`,
      );
      return;
    }

    try {
      setSubmitting(true);

      const requestData: StockTransferRequest = {
        fromStoreId,
        toStoreId,
        productId,
        quantity: quantityNum,
        notes: notes.trim() || undefined,
      };

      await adminInventoryAPI.transferStock(accessToken, requestData);

      toast.success("Stock transferred successfully");

      // Reset form
      setFromStoreId("");
      setToStoreId("");
      setProductId("");
      setQuantity("");
      setNotes("");
      setSearchQuery("");
      setShowDropdown(false);
      setSelectedProduct(null);
      setAvailableStock(0);

      // Reload products to update stock levels
      loadProducts();
    } catch (error) {
      console.error("Error transferring stock:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to transfer stock";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProductSelect = (id: string, name: string) => {
    setProductId(id);
    setSearchQuery(name);
    setShowDropdown(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setProductId(""); // Clear selection when typing
  };

  const isFormValid =
    fromStoreId &&
    toStoreId &&
    productId &&
    quantity &&
    parseInt(quantity) > 0 &&
    parseInt(quantity) <= availableStock;

  return {
    // Data
    stores,
    products,
    loadingStores,
    loadingProducts,
    submitting,
    // Form state
    fromStoreId,
    toStoreId,
    productId,
    quantity,
    notes,
    searchQuery,
    showDropdown,
    selectedProduct,
    availableStock,
    isFormValid,
    // Setters
    setFromStoreId,
    setToStoreId,
    setQuantity,
    setNotes,
    setShowDropdown,
    // Handlers
    handleSubmit,
    handleProductSelect,
    handleSearchChange,
  };
}
