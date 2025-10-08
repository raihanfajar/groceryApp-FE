"use client";

import { useState, useEffect, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { handleApiError } from "@/utils/errorHandler";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface MarketingPromo {
  id: string;
  name: string;
  description: string | null;
  bannerImageUrl: string | null;
  displayOrder: number | null;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditMarketingPromoPage({ params }: Props) {
  const { id } = use(params);
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch promo details
  const { data: promo, isLoading } = useQuery({
    queryKey: ["marketing-promo", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/discounts/marketing-promos`);
      const promos = (response.data as { data: MarketingPromo[] }).data;
      return promos.find((p) => p.id === id);
    },
    enabled: !!id,
  });

  // Set initial image preview
  useEffect(() => {
    if (promo?.bannerImageUrl) {
      setImagePreview(promo.bannerImageUrl);
    }
  }, [promo]);

  const updatePromoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.put(
        `/discounts/marketing-promos/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-promos"] });
      queryClient.invalidateQueries({ queryKey: ["marketing-promo", id] });
      toast.success("Marketing promo updated successfully!");
      router.push("/admin/marketing");
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update marketing promo",
      );
      toast.error(errorMessage);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updatePromoMutation.mutate(formData);
  };

  if (!admin?.isSuper) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                Only Super Admins can access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!promo) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Promo Not Found</CardTitle>
              <CardDescription>
                The marketing promo you&apos;re looking for doesn&apos;t exist.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/marketing"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketing Promos
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Marketing Promo
          </h1>
          <p className="text-muted-foreground">
            Update the promotional banner details
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Promo Details</CardTitle>
            <CardDescription>
              Modify the information below to update the marketing promotion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Promo Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Holiday Sale 2025"
                  defaultValue={promo.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the promotion"
                  defaultValue={promo.description || ""}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    defaultValue={new Date(promo.startDate)
                      .toISOString()
                      .slice(0, 16)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    defaultValue={new Date(promo.endDate)
                      .toISOString()
                      .slice(0, 16)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    placeholder="e.g., 1"
                    defaultValue={promo.displayOrder || 1}
                  />
                  <p className="text-muted-foreground text-xs">
                    Lower numbers appear first in the carousel
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    defaultValue={promo.isActive.toString()}
                    className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerImage">Update Banner Image</Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-muted-foreground text-xs">
                  Leave empty to keep current image. Recommended size:
                  1200x400px
                </p>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <Label>Current/Preview Image</Label>
                  <div className="relative h-64 w-full overflow-hidden rounded-lg border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/marketing")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updatePromoMutation.isPending}>
                  {updatePromoMutation.isPending
                    ? "Updating..."
                    : "Update Promo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
