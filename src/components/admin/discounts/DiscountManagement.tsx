"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  Percent as PercentIcon,
} from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";
import {
  Discount,
  DiscountType,
  DiscountValueType,
  Store,
} from "@/types/discount";
import CreateDiscountForm from "./CreateDiscountForm";
import EditDiscountForm from "./EditDiscountForm";

export default function DiscountManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  // Fetch discounts
  const {
    data: discounts,
    isLoading: isLoadingDiscounts,
    error: discountsError,
  } = useQuery({
    queryKey: ["discounts", admin?.id, admin?.store?.id, selectedStoreId],
    queryFn: async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (admin?.isSuper && selectedStoreId) {
          params.append("storeId", selectedStoreId);
        }

        const response = await axiosInstance.get(
          `/discounts?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${admin?.accessToken}` },
          },
        );
        console.log("Discounts response:", response.data);
        const result = response.data as {
          status: string;
          data: {
            data: Discount[];
            pagination: {
              page: number;
              limit: number;
              total: number;
              totalPages: number;
            };
          };
        };
        return Array.isArray(result.data.data) ? result.data.data : [];
      } catch (error) {
        console.error("Error fetching discounts:", error);
        throw error;
      }
    },
    enabled: !!admin?.accessToken,
  });

  // Fetch stores for Super Admin filter
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/stores", {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      const data = (response.data as { data: Store[] }).data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!admin?.accessToken && !!admin?.isSuper,
  });

  // Delete discount mutation
  const deleteDiscountMutation = useMutation({
    mutationFn: async (discountId: string) => {
      const response = await axiosInstance.delete(`/discounts/${discountId}`, {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", admin?.id, admin?.store?.id, selectedStoreId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to delete discount");
      toast.error(errorMessage);
    },
  });

  // Toggle discount status mutation
  const toggleDiscountMutation = useMutation({
    mutationFn: async ({
      discountId,
      isActive,
    }: {
      discountId: string;
      isActive: boolean;
    }) => {
      const response = await axiosInstance.put(
        `/discounts/${discountId}`,
        { isActive },
        {
          headers: { Authorization: `Bearer ${admin?.accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", admin?.id, admin?.store?.id, selectedStoreId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update discount status",
      );
      toast.error(errorMessage);
    },
  });

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

  const filteredDiscounts = (discounts || []).filter((discount) => {
    // Text search filter - backend handles store filtering
    return (
      discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getDiscountTypeColor = (type: DiscountType) => {
    switch (type) {
      case DiscountType.MANUAL:
        return "bg-blue-100 text-blue-800";
      case DiscountType.MINIMUM_PURCHASE:
        return "bg-green-100 text-green-800";
      case DiscountType.BOGO:
        return "bg-purple-100 text-purple-800";
      case DiscountType.REGULAR:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDiscountTypeLabel = (type: DiscountType) => {
    switch (type) {
      case DiscountType.MANUAL:
        return "Manual";
      case DiscountType.MINIMUM_PURCHASE:
        return "Min Purchase";
      case DiscountType.BOGO:
        return "BOGO";
      case DiscountType.REGULAR:
        return "Regular";
      default:
        return type;
    }
  };

  const formatDiscountValue = (discount: Discount) => {
    if (discount.valueType === DiscountValueType.PERCENTAGE) {
      return `${discount.value}%`;
    } else {
      return `Rp ${discount.value.toLocaleString()}`;
    }
  };

  if (isLoadingDiscounts) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading discounts...</p>
        </div>
      </div>
    );
  }

  // Show error message if not authenticated
  if (!admin?.accessToken) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-lg font-medium text-amber-800">
              Authentication Required
            </h3>
            <p className="mt-2 text-sm text-amber-700">
              Please log in as an admin to view and manage discounts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if query failed
  if (discountsError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search discounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Store Filter for Super Admin */}
          {admin?.isSuper && (
            <div className="min-w-[200px]">
              <Select
                value={selectedStoreId || "all"}
                onValueChange={(value) =>
                  setSelectedStoreId(value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Stores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stores</SelectItem>
                  {(stores || []).map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name} - {store.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Discount
        </Button>
      </div>

      {/* Discounts Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {discounts?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Total Discounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {discounts?.filter((d) => d.isActive).length || 0}
            </div>
            <p className="text-sm text-gray-600">Active Discounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {discounts?.filter((d) => d.type === DiscountType.BOGO).length ||
                0}
            </div>
            <p className="text-sm text-gray-600">BOGO Discounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {discounts?.reduce((sum, d) => sum + d.currentUsageCount, 0) || 0}
            </div>
            <p className="text-sm text-gray-600">Total Usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Discounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Discounts ({filteredDiscounts?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDiscounts && filteredDiscounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  {admin?.isSuper && <TableHead>Store</TableHead>}
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount) => (
                  <TableRow key={discount.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{discount.name}</div>
                        {discount.description && (
                          <div className="text-sm text-gray-500">
                            {discount.description}
                          </div>
                        )}
                        {discount.minTransactionValue && (
                          <div className="text-xs text-blue-600">
                            Min: Rp{" "}
                            {discount.minTransactionValue.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDiscountTypeColor(discount.type)}>
                        {getDiscountTypeLabel(discount.type)}
                      </Badge>
                    </TableCell>
                    {admin?.isSuper && (
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">
                            {discount.store.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {discount.store.city}, {discount.store.province}
                          </div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <PercentIcon className="h-3 w-3 text-gray-400" />
                        <span className="font-medium">
                          {formatDiscountValue(discount)}
                        </span>
                      </div>
                      {discount.maxDiscountAmount &&
                        discount.valueType === DiscountValueType.PERCENTAGE && (
                          <div className="text-xs text-gray-500">
                            Max: Rp{" "}
                            {discount.maxDiscountAmount.toLocaleString()}
                          </div>
                        )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{discount.currentUsageCount} used</div>
                        {discount.totalUsageLimit && (
                          <div className="text-xs text-gray-500">
                            / {discount.totalUsageLimit} limit
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <div>
                          <div>
                            {new Date(discount.startDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            to {new Date(discount.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={discount.isActive ? "default" : "secondary"}
                        onClick={() =>
                          handleToggleStatus(discount.id, discount.isActive)
                        }
                        className={
                          discount.isActive
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {discount.isActive ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditDiscount(discount)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <PercentIcon className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No discounts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Get started by creating your first discount."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Discount Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discount</DialogTitle>
          </DialogHeader>
          <CreateDiscountForm onClose={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
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
