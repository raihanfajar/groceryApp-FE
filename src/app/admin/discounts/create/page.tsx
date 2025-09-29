"use client";

import { useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ShoppingBag,
  ArrowLeft,
  Check,
  X,
  Package2,
  DollarSign,
  Tag,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  picture1?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CreateDiscountPage() {
  const router = useRouter();
  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreateDiscountData>({
    name: "",
    description: "",
    type: DiscountType.REGULAR,
    valueType: DiscountValueType.PERCENTAGE,
    value: 0,
    startDate: "",
    endDate: "",
    productIds: [],
  });

  // Product filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 20;

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      try {
        const response = await axiosInstance.get("/categories");
        console.log("Categories response:", response.data);

        // Based on the backend controller, the response format is:
        // { status: "success", data: { categories: Category[] } }
        const result = response.data as {
          status: string;
          data: {
            categories: Category[];
          };
        };

        if (result?.data?.categories && Array.isArray(result.data.categories)) {
          return result.data.categories;
        }

        console.warn("Categories response structure not as expected:", result);
        return [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });

  // Fetch products with filtering
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: [
      "admin-products",
      searchTerm,
      selectedCategory,
      priceRange,
      currentPage,
    ],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory && selectedCategory !== "all")
          params.append("categoryId", selectedCategory);
        if (priceRange.min) params.append("minPrice", priceRange.min);
        if (priceRange.max) params.append("maxPrice", priceRange.max);
        params.append("page", currentPage.toString());
        params.append("limit", productsPerPage.toString());

        const endpoint = admin?.accessToken
          ? `/products/admin/all?${params.toString()}`
          : `/products?${params.toString()}`;

        const response = await axiosInstance.get(endpoint, {
          ...(admin?.accessToken && {
            headers: { Authorization: `Bearer ${admin.accessToken}` },
          }),
        });

        const result = response.data as {
          status: string;
          data: {
            products: Product[];
            pagination?: {
              total: number;
              totalPages: number;
              page: number;
              limit: number;
            };
          };
        };

        return {
          products: Array.isArray(result.data.products)
            ? result.data.products
            : [],
          pagination: result.data.pagination || {
            total: result.data.products?.length || 0,
            totalPages: 1,
            page: 1,
            limit: productsPerPage,
          },
        };
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: true,
  });

  // Fetch stores for Super Admin
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
      router.push("/admin/discounts");
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(error, "Failed to create discount");
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.productIds || formData.productIds.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (
      admin?.isSuper &&
      formData.storeId === "" &&
      formData.storeId !== undefined
    ) {
      toast.error("Please select a target store or choose Global option");
      return;
    }

    // Prepare submission data based on discount type
    if (formData.type === DiscountType.BOGO) {
      // For BOGO discounts, exclude value and valueType fields since they're not needed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { value, valueType, maxDiscountAmount, ...bogoData } = formData;
      createDiscountMutation.mutate(bogoData as CreateDiscountData);
    } else {
      createDiscountMutation.mutate(formData);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const handleProductToggle = (productId: string) => {
    setFormData((prev) => {
      const currentIds = prev.productIds || [];
      const exists = currentIds.includes(productId);
      const nextIds = exists
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId];
      if (
        exists &&
        currentIds.length - 1 === nextIds.length &&
        currentIds.every((v, i) => v === nextIds[i])
      )
        return prev; // defensive
      return { ...prev, productIds: nextIds };
    });
  };

  const handleSelectAllVisible = () => {
    if (!productsData?.products) return;
    const visibleProductIds = productsData.products.map((p) => p.id);
    setFormData((prev) => {
      const currentIds = prev.productIds || [];
      const allVisibleSelected = visibleProductIds.every((id) =>
        currentIds.includes(id),
      );
      const nextIds = allVisibleSelected
        ? currentIds.filter((id) => !visibleProductIds.includes(id))
        : Array.from(new Set([...currentIds, ...visibleProductIds]));
      if (
        currentIds.length === nextIds.length &&
        currentIds.every((v, i) => v === nextIds[i])
      )
        return prev;
      return { ...prev, productIds: nextIds };
    });
  };

  const products = useMemo(
    () => productsData?.products || [],
    [productsData?.products],
  );
  const pagination = productsData?.pagination;
  const selectedCount = formData.productIds?.length || 0;

  // Memoize the "select all visible" checkbox state to prevent infinite re-renders
  const isAllVisibleSelected = useMemo(() => {
    return (
      products.length > 0 &&
      products.every((p) => formData.productIds?.includes(p.id))
    );
  }, [products, formData.productIds]);

  // Memoize product selection states to prevent infinite re-renders
  const selectedProductIds = useMemo(
    () => new Set(formData.productIds || []),
    [formData.productIds],
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Discount
            </h1>
            <p className="text-gray-600">
              Set up a new discount promotion for your products
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Discount Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Discount Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Weekend Special 20% Off"
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
                        <SelectItem value={DiscountType.REGULAR}>
                          Regular
                        </SelectItem>
                        <SelectItem value={DiscountType.MINIMUM_PURCHASE}>
                          Minimum Purchase
                        </SelectItem>
                        <SelectItem value={DiscountType.BOGO}>
                          Buy One Get One (BOGO)
                        </SelectItem>
                        <SelectItem value={DiscountType.MANUAL}>
                          Manual
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Store Selection for Super Admin */}
                {admin?.isSuper && (
                  <div className="space-y-2">
                    <Label htmlFor="storeId">Target Store *</Label>
                    <Select
                      value={formData.storeId || "global"}
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
                        <SelectItem value="global">
                          🌍 Global (All Stores)
                        </SelectItem>
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
                    placeholder="Describe your discount offer..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discount Value */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Discount Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hide value fields for BOGO discounts */}
                {formData.type !== DiscountType.BOGO && (
                  <>
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
                            setFormData({
                              ...formData,
                              value: parseInt(e.target.value) || 0,
                            })
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
                              maxDiscountAmount:
                                parseInt(e.target.value) || undefined,
                            })
                          }
                          min="0"
                          placeholder="Optional maximum cap"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Show BOGO explanation when BOGO is selected */}
                {formData.type === DiscountType.BOGO && (
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-blue-900">
                      BOGO Discount Information
                    </h4>
                    <p className="text-sm text-blue-700">
                      BOGO (Buy One Get One) discounts don&apos;t use percentage
                      or fixed amount values. Instead, configure the buy and get
                      quantities in the BOGO settings section below.
                    </p>
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
                          minTransactionValue:
                            parseInt(e.target.value) || undefined,
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
                              buyQuantity:
                                parseInt(e.target.value) || undefined,
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
                              getQuantity:
                                parseInt(e.target.value) || undefined,
                            })
                          }
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="maxBogoSets">
                          Max BOGO Sets Per Transaction
                        </Label>
                        <Input
                          id="maxBogoSets"
                          type="number"
                          value={formData.maxBogoSets || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxBogoSets:
                                parseInt(e.target.value) || undefined,
                            })
                          }
                          min="1"
                          placeholder="Optional limit"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
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
                        <Label htmlFor="applyToSameProduct">
                          Apply to same product
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule & Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule & Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          totalUsageLimit:
                            parseInt(e.target.value) || undefined,
                        })
                      }
                      min="1"
                      placeholder="Optional total limit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUsagePerCustomer">
                      Max Usage Per Customer
                    </Label>
                    <Input
                      id="maxUsagePerCustomer"
                      type="number"
                      value={formData.maxUsagePerCustomer || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxUsagePerCustomer:
                            parseInt(e.target.value) || undefined,
                        })
                      }
                      min="1"
                      placeholder="Optional per-customer limit"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Selection */}
          <div className="space-y-6">
            {/* Selected Products Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Selected Products
                  </div>
                  <Badge variant="secondary">{selectedCount} selected</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCount === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500">
                    No products selected yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {selectedCount} product{selectedCount !== 1 ? "s" : ""}{" "}
                      selected for this discount
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({ ...formData, productIds: [] })
                      }
                      className="w-full"
                    >
                      Clear All Selections
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={
                  createDiscountMutation.isPending ||
                  !formData.productIds ||
                  formData.productIds.length === 0 ||
                  (admin?.isSuper && formData.storeId === "")
                }
                className="w-full"
                size="lg"
              >
                {createDiscountMutation.isPending
                  ? "Creating..."
                  : "Create Discount"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* Product Selection Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package2 className="h-5 w-5" />
              Product Selection
            </CardTitle>
            <p className="text-sm text-gray-600">
              Select products that this discount will apply to
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {((selectedCategory && selectedCategory !== "all") ||
                    priceRange.min ||
                    priceRange.max) && (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {Array.isArray(categories) &&
                          categories.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Min Price (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, min: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Price (Rp)</Label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      value={priceRange.max}
                      onChange={(e) => {
                        setPriceRange({ ...priceRange, max: e.target.value });
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="flex justify-end md:col-span-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Product List Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAllVisibleSelected}
                  onCheckedChange={handleSelectAllVisible}
                />
                <Label className="text-sm">
                  Select all visible ({products.length} items)
                </Label>
              </div>

              {pagination && (
                <p className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * productsPerPage + 1} to{" "}
                  {Math.min(currentPage * productsPerPage, pagination.total)} of{" "}
                  {pagination.total} products
                </p>
              )}
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : productsError ? (
              <div className="py-8 text-center">
                <p className="text-red-600">
                  Error loading products. Please try again.
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const isSelected = selectedProductIds.has(product.id);
                  return (
                    <div
                      key={product.id}
                      className={`group rounded-lg border p-4 transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleProductToggle(product.id)
                          }
                          className="mt-1"
                        />
                        <button
                          type="button"
                          onClick={() => handleProductToggle(product.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <h4 className="mb-1 truncate text-sm leading-5 font-medium">
                            {product.name}
                          </h4>
                          {product.category && (
                            <p className="mb-2 text-xs text-gray-500">
                              {product.category.name}
                            </p>
                          )}
                          <p className="text-sm font-semibold text-blue-600">
                            Rp {product.price?.toLocaleString()}
                          </p>
                        </button>
                        {isSelected && (
                          <Check className="h-5 w-5 flex-shrink-0 text-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }).map(
                    (_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            type="button"
                            variant={currentPage === page ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    },
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
