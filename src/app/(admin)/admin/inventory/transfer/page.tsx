"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  ArrowLeftRight,
  ArrowLeft,
  Package,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { adminInventoryAPI } from "@/services/admin/inventoryAPI";
import { adminProductAPI } from "@/services/admin/productAPI";
import { Store, StockTransferRequest } from "@/types/admin/inventory";
import { AdminProduct } from "@/types/admin/product";
import Image from "next/image";

export default function StockTransferPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

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

  // Selected product details
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );
  const [availableStock, setAvailableStock] = useState<number>(0);

  // Redirect if not Super Admin
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin-login");
      return;
    }

    if (!admin?.isSuper) {
      toast.error("Only Super Admin can transfer stock between stores");
      router.push("/admin/inventory");
      return;
    }
  }, [admin, isAuthenticated, router]);

  // Load stores
  const loadStores = useCallback(async () => {
    if (!admin?.accessToken) return;

    try {
      setLoadingStores(true);
      const response = await adminInventoryAPI.getStores(admin.accessToken);
      setStores(response.data);
    } catch (error) {
      console.error("Error loading stores:", error);
      toast.error("Failed to load stores");
    } finally {
      setLoadingStores(false);
    }
  }, [admin?.accessToken]);

  // Load products
  const loadProducts = useCallback(async () => {
    if (!admin?.accessToken) return;

    try {
      setLoadingProducts(true);
      const response = await adminProductAPI.getProducts(admin.accessToken, {
        search: searchQuery,
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
  }, [admin?.accessToken, searchQuery]);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin?.accessToken) return;

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

      await adminInventoryAPI.transferStock(admin.accessToken, requestData);

      toast.success("Stock transferred successfully");

      // Reset form
      setFromStoreId("");
      setToStoreId("");
      setProductId("");
      setQuantity("");
      setNotes("");
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!admin?.isSuper) {
    return null;
  }

  const fromStore = stores.find((s) => s.id === fromStoreId);
  const toStore = stores.find((s) => s.id === toStoreId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/admin/inventory">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Inventory
                </Button>
              </Link>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Transfer Stock
            </h2>
            <p className="mt-1 text-gray-600">
              Transfer inventory between stores
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
            <ArrowLeftRight className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Transfer Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Details</CardTitle>
                  <CardDescription>
                    Select stores, product, and quantity to transfer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Store Selection */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fromStore">
                        From Store <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={fromStoreId}
                        onValueChange={setFromStoreId}
                        disabled={loadingStores}
                      >
                        <SelectTrigger id="fromStore">
                          <SelectValue
                            placeholder={
                              loadingStores
                                ? "Loading stores..."
                                : "Select source store"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {stores
                            .filter((store) => store.id !== toStoreId)
                            .map((store) => (
                              <SelectItem key={store.id} value={store.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {store.name} - {store.city}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toStore">
                        To Store <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={toStoreId}
                        onValueChange={setToStoreId}
                        disabled={loadingStores}
                      >
                        <SelectTrigger id="toStore">
                          <SelectValue
                            placeholder={
                              loadingStores
                                ? "Loading stores..."
                                : "Select destination store"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {stores
                            .filter((store) => store.id !== fromStoreId)
                            .map((store) => (
                              <SelectItem key={store.id} value={store.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-gray-500" />
                                  <span>
                                    {store.name} - {store.city}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="product">
                      Product <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                      <Select
                        value={productId}
                        onValueChange={setProductId}
                        disabled={loadingProducts || !fromStoreId}
                      >
                        <SelectTrigger id="product">
                          <SelectValue
                            placeholder={
                              !fromStoreId
                                ? "Select source store first"
                                : loadingProducts
                                  ? "Loading products..."
                                  : "Select product"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredProducts.map((product) => {
                            const storeStock = product.storeStock?.find(
                              (s) => s.storeId === fromStoreId,
                            );
                            const stock = storeStock?.stock || 0;

                            return (
                              <SelectItem
                                key={product.id}
                                value={product.id}
                                disabled={stock <= 0}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2">
                                    {product.picture1 ? (
                                      <Image
                                        src={product.picture1}
                                        alt={product.name}
                                        width={24}
                                        height={24}
                                        className="rounded object-cover"
                                      />
                                    ) : (
                                      <Package className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span>{product.name}</span>
                                  </div>
                                  <span
                                    className={`text-xs ${
                                      stock <= 0
                                        ? "text-red-600"
                                        : stock < (storeStock?.minStock || 0)
                                          ? "text-orange-600"
                                          : "text-green-600"
                                    }`}
                                  >
                                    Stock: {stock}
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={availableStock}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity to transfer"
                      disabled={!productId || !fromStoreId}
                    />
                    {availableStock > 0 && (
                      <p className="text-sm text-gray-500">
                        Available stock at source store: {availableStock} units
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any notes about this transfer..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transfer Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Transfer Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* From Store */}
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-red-900">
                      <Building2 className="h-4 w-4" />
                      From
                    </div>
                    <p className="text-sm text-red-700">
                      {fromStore
                        ? `${fromStore.name} - ${fromStore.city}`
                        : "Not selected"}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowLeftRight className="h-6 w-6 text-gray-400" />
                  </div>

                  {/* To Store */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-green-900">
                      <Building2 className="h-4 w-4" />
                      To
                    </div>
                    <p className="text-sm text-green-700">
                      {toStore
                        ? `${toStore.name} - ${toStore.city}`
                        : "Not selected"}
                    </p>
                  </div>

                  {/* Product Info */}
                  {selectedProduct && (
                    <div className="rounded-lg border bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        {selectedProduct.picture1 ? (
                          <Image
                            src={selectedProduct.picture1}
                            alt={selectedProduct.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {selectedProduct.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {selectedProduct.category.name}
                          </p>
                        </div>
                      </div>
                      {quantity && (
                        <div className="mt-3 border-t pt-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium text-gray-900">
                              {quantity} units
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      submitting ||
                      !fromStoreId ||
                      !toStoreId ||
                      !productId ||
                      !quantity ||
                      parseInt(quantity) <= 0 ||
                      parseInt(quantity) > availableStock
                    }
                  >
                    {submitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Transferring...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm Transfer
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        Stock will be immediately updated in both stores
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>
                        Transfer will be recorded in the stock journal
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Ensure sufficient stock at source store</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600">•</span>
                      <span>This action cannot be undone automatically</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
