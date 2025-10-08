"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Discount } from "@/types/discount";
import EditDiscountForm from "./EditDiscountForm";
import LoadingLogo from "@/components/ui/LoadingLogo";
import DiscountHeader from "./management/DiscountHeader";
import DiscountStatistics from "./management/DiscountStatistics";
import DiscountTableRow from "./management/DiscountTableRow";
import EmptyDiscountState from "./management/EmptyDiscountState";
import {
  useDiscounts,
  useStoresFilter,
  useDeleteDiscount,
  useToggleDiscountStatus,
} from "@/hooks/admin/useDiscountManagement";

export default function DiscountManagement() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { admin } = useAdminAuthStore();

  const {
    data: discounts,
    isLoading,
    error,
  } = useDiscounts(
    admin?.id,
    admin?.store?.id,
    selectedStoreId,
    admin?.accessToken,
  );

  const { data: stores } = useStoresFilter(admin?.accessToken, admin?.isSuper);

  const deleteDiscountMutation = useDeleteDiscount(
    admin?.id,
    admin?.store?.id,
    selectedStoreId,
    admin?.accessToken,
  );

  const toggleDiscountMutation = useToggleDiscountStatus(
    admin?.id,
    admin?.store?.id,
    selectedStoreId,
    admin?.accessToken,
  );

  const filteredDiscounts = (discounts || []).filter(
    (discount) =>
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteDiscount = (discountId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this discount? This action cannot be undone.",
      )
    ) {
      deleteDiscountMutation.mutate(discountId);
    }
  };

  const handleEditDiscount = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = (discountId: string, currentStatus: boolean) => {
    toggleDiscountMutation.mutate({ discountId, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingLogo size="lg" message="Loading discounts..." />
      </div>
    );
  }

  if (!admin?.accessToken) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-lg font-medium text-amber-800">
            Authentication Required
          </h3>
          <p className="mt-2 text-sm text-amber-700">
            Please log in as an admin to view and manage discounts.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h3 className="text-lg font-medium text-red-800">
            Error Loading Discounts
          </h3>
          <p className="mt-2 text-sm text-red-700">
            Failed to load discounts. Please check your connection and try
            again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DiscountHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isSuper={!!admin?.isSuper}
        stores={stores}
        selectedStoreId={selectedStoreId}
        onStoreChange={setSelectedStoreId}
        onCreateClick={() => router.push("/admin/discounts/create")}
      />

      <DiscountStatistics discounts={discounts || []} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Discounts ({filteredDiscounts?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {filteredDiscounts && filteredDiscounts.length > 0 ? (
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[120px]">Type</TableHead>
                  {admin?.isSuper && (
                    <TableHead className="min-w-[150px]">Store</TableHead>
                  )}
                  <TableHead className="min-w-[180px]">Products</TableHead>
                  <TableHead className="min-w-[100px]">Value</TableHead>
                  <TableHead className="min-w-[100px]">Usage</TableHead>
                  <TableHead className="min-w-[140px]">Period</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <DiscountTableRow
                    key={discount.id}
                    discount={discount}
                    isSuper={!!admin?.isSuper}
                    onEdit={handleEditDiscount}
                    onDelete={handleDeleteDiscount}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyDiscountState hasSearchTerm={!!searchTerm} />
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
          </DialogHeader>
          <EditDiscountForm
            discount={editingDiscount}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingDiscount(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
