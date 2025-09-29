"use client";

import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler";
import {
  CreateDiscountData,
  DiscountType,
  DiscountValueType,
  Store,
} from "@/types/discount";

interface CreateDiscountFormProps {
  onClose: () => void;
}

export default function CreateDiscountForm({
  onClose,
}: CreateDiscountFormProps) {
  const [formData, setFormData] = useState<CreateDiscountData>({
    name: "",
    description: "",
    type: DiscountType.MANUAL,
    valueType: DiscountValueType.PERCENTAGE,
    value: 0,
    startDate: "",
    endDate: "",
    productIds: [],
  });

  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  // Fetch products for selection
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      // Try admin endpoint first, fallback to public endpoint
      try {
        if (admin?.accessToken) {
          const response = await axiosInstance.get("/products/admin/all", {
            headers: { Authorization: `Bearer ${admin.accessToken}` },
          });
          console.log("Admin products response:", response.data);
          const result = response.data as {
            status: string;
            data: {
              products: { id: string; name: string; price: number }[];
            };
          };
          return Array.isArray(result.data.products)
            ? result.data.products
            : [];
        } else {
          // Fallback to public endpoint
          console.log("Using public products endpoint as fallback");
          const response = await axiosInstance.get("/products");
          console.log("Public products response:", response.data);
          const result = response.data as {
            status: string;
            data: {
              products: { id: string; name: string; price: number }[];
            };
          };
          return Array.isArray(result.data.products)
            ? result.data.products
            : [];
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: true, // Always enabled, will use fallback if no token
  });

  // Fetch stores for Super Admin selection
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

  // Create discount mutation
  const createDiscountMutation = useMutation({
    mutationFn: async (data: CreateDiscountData) => {
      const response = await axiosInstance.post("/discounts", data, {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount created successfully");
      queryClient.invalidateQueries({
        queryKey: ["discounts", admin?.id, admin?.store?.id],
      });
      onClose();
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to create discount");
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Super Admin store selection
    if (
      admin?.isSuper &&
      formData.storeId === "" &&
      formData.storeId !== undefined
    ) {
      toast.error("Please select a target store or choose Global option");
      return;
    }

    createDiscountMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Discount Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Discount Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value: DiscountType) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DiscountType.MANUAL}>Manual</SelectItem>
              <SelectItem value={DiscountType.MINIMUM_PURCHASE}>
                Minimum Purchase
              </SelectItem>
              <SelectItem value={DiscountType.BOGO}>
                Buy One Get One (BOGO)
              </SelectItem>
              <SelectItem value={DiscountType.REGULAR}>Regular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Store Selection for Super Admin */}
      {admin?.isSuper && (
        <div className="space-y-2">
          <Label htmlFor="storeId">Target Store *</Label>
          <Select
            value={formData.storeId || ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                storeId: value === "global" ? undefined : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">🌍 Global (All Stores)</SelectItem>
              {(stores || []).map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  🏪 {store.name} - {store.city}, {store.province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600">
            {formData.storeId
              ? `Discount will apply to ${stores?.find((s) => s.id === formData.storeId)?.name || "selected store"} only`
              : formData.storeId === undefined && admin?.isSuper
                ? "Discount will apply to all stores globally"
                : "Please select where this discount should be applied"}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="valueType">Value Type *</Label>
          <Select
            value={formData.valueType}
            onValueChange={(value: DiscountValueType) =>
              setFormData({ ...formData, valueType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DiscountValueType.PERCENTAGE}>
                Percentage (%)
              </SelectItem>
              <SelectItem value={DiscountValueType.NOMINAL}>
                Fixed Amount (Rp)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            {formData.valueType === DiscountValueType.PERCENTAGE
              ? "Percentage"
              : "Amount"}{" "}
            *
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: parseInt(e.target.value) || 0 })
            }
            min="0"
            max={
              formData.valueType === DiscountValueType.PERCENTAGE
                ? "100"
                : undefined
            }
            required
          />
        </div>
      </div>

      {formData.valueType === DiscountValueType.PERCENTAGE && (
        <div className="space-y-2">
          <Label htmlFor="maxDiscountAmount">
            Maximum Discount Amount (Rp)
          </Label>
          <Input
            id="maxDiscountAmount"
            type="number"
            value={formData.maxDiscountAmount || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxDiscountAmount: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
          />
        </div>
      )}

      {formData.type === DiscountType.MINIMUM_PURCHASE && (
        <div className="space-y-2">
          <Label htmlFor="minTransactionValue">
            Minimum Transaction Value (Rp) *
          </Label>
          <Input
            id="minTransactionValue"
            type="number"
            value={formData.minTransactionValue || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                minTransactionValue: parseInt(e.target.value) || undefined,
              })
            }
            min="0"
            required
          />
        </div>
      )}

      {formData.type === DiscountType.BOGO && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="buyQuantity">Buy Quantity *</Label>
              <Input
                id="buyQuantity"
                type="number"
                value={formData.buyQuantity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyQuantity: parseInt(e.target.value) || undefined,
                  })
                }
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="getQuantity">Get Quantity *</Label>
              <Input
                id="getQuantity"
                type="number"
                value={formData.getQuantity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    getQuantity: parseInt(e.target.value) || undefined,
                  })
                }
                min="1"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxBogoSets">Max BOGO Sets Per Transaction</Label>
              <Input
                id="maxBogoSets"
                type="number"
                value={formData.maxBogoSets || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxBogoSets: parseInt(e.target.value) || undefined,
                  })
                }
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="applyToSameProduct"
                checked={formData.applyToSameProduct ?? true}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    applyToSameProduct: checked as boolean,
                  })
                }
              />
              <Label htmlFor="applyToSameProduct">Apply to same product</Label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="totalUsageLimit">Total Usage Limit</Label>
          <Input
            id="totalUsageLimit"
            type="number"
            value={formData.totalUsageLimit || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalUsageLimit: parseInt(e.target.value) || undefined,
              })
            }
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUsagePerCustomer">Max Usage Per Customer</Label>
          <Input
            id="maxUsagePerCustomer"
            type="number"
            value={formData.maxUsagePerCustomer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxUsagePerCustomer: parseInt(e.target.value) || undefined,
              })
            }
            min="1"
          />
        </div>
      </div>

      {/* Product Selection */}
      <div className="space-y-2">
        <Label>Select Products *</Label>
        {!admin?.accessToken && (
          <p className="rounded bg-amber-50 p-2 text-sm text-amber-600">
            ⚠️ Using public product list. Please log in as admin for full
            access.
          </p>
        )}
        <div className="max-h-60 overflow-y-auto rounded-md border p-4">
          {products && products.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={formData.productIds?.length === products.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFormData({
                        ...formData,
                        productIds: products.map((p) => p.id),
                      });
                    } else {
                      setFormData({ ...formData, productIds: [] });
                    }
                  }}
                />
                <Label htmlFor="select-all" className="font-medium">
                  Select All Products
                </Label>
              </div>
              <div className="border-t pt-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={product.id}
                      checked={
                        formData.productIds?.includes(product.id) || false
                      }
                      onCheckedChange={(checked) => {
                        const currentIds = formData.productIds || [];
                        if (checked) {
                          setFormData({
                            ...formData,
                            productIds: [...currentIds, product.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            productIds: currentIds.filter(
                              (id) => id !== product.id,
                            ),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={product.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex-1 truncate">{product.name}</span>
                        <span className="text-sm font-medium whitespace-nowrap text-blue-600">
                          Rp {product.price?.toLocaleString()}
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ) : productsLoading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : productsError ? (
            <p className="text-sm text-red-600">
              Error loading products. Please try again.
            </p>
          ) : (
            <p className="text-sm text-gray-500">No products available.</p>
          )}
        </div>
        {(!formData.productIds || formData.productIds.length === 0) && (
          <p className="text-sm text-red-600">
            At least one product must be selected
          </p>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            createDiscountMutation.isPending ||
            !formData.productIds ||
            formData.productIds.length === 0 ||
            (admin?.isSuper && formData.storeId === "")
          }
        >
          {createDiscountMutation.isPending ? "Creating..." : "Create Discount"}
        </Button>
      </DialogFooter>
    </form>
  );
}
