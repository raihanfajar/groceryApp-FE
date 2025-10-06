"use client";

import { useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useStockTransfer } from "@/hooks/admin/useStockTransfer";
import StoreSelector from "@/components/admin/inventory/transfer/StoreSelector";
import ProductSelector from "@/components/admin/inventory/transfer/ProductSelector";
import TransferSummary from "@/components/admin/inventory/transfer/TransferSummary";
import TransferHelpCard from "@/components/admin/inventory/transfer/TransferHelpCard";

export default function StockTransferPage() {
  const { admin, isAuthenticated } = useAdminAuthStore();
  const router = useRouter();

  const {
    stores,
    products,
    loadingStores,
    loadingProducts,
    submitting,
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
    setFromStoreId,
    setToStoreId,
    setQuantity,
    setNotes,
    setShowDropdown,
    handleSubmit,
    handleProductSelect,
    handleSearchChange,
  } = useStockTransfer(admin?.accessToken);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

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
        <form onSubmit={onSubmit}>
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
                  <StoreSelector
                    stores={stores}
                    fromStoreId={fromStoreId}
                    toStoreId={toStoreId}
                    loadingStores={loadingStores}
                    onFromStoreChange={setFromStoreId}
                    onToStoreChange={setToStoreId}
                  />

                  {/* Product Selection */}
                  <ProductSelector
                    products={products}
                    fromStoreId={fromStoreId}
                    searchQuery={searchQuery}
                    productId={productId}
                    showDropdown={showDropdown}
                    loadingProducts={loadingProducts}
                    onSearchChange={handleSearchChange}
                    onProductSelect={handleProductSelect}
                    onDropdownToggle={setShowDropdown}
                  />

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={availableStock}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity to transfer"
                      disabled={!productId || !fromStoreId}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
              <TransferSummary
                fromStore={fromStore}
                toStore={toStore}
                selectedProduct={selectedProduct}
                quantity={quantity}
                submitting={submitting}
                isFormValid={Boolean(isFormValid)}
              />

              <TransferHelpCard />
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
