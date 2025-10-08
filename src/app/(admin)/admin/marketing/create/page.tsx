"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateMarketingPromoPage() {
  const { admin } = useAdminAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createPromoMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.post(
        "/discounts/marketing-promos",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing-promos"] });
      toast.success("Marketing promo created successfully!");
      router.push("/admin/marketing");
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to create marketing promo",
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
    createPromoMutation.mutate(formData);
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
            Create New Marketing Promo
          </h1>
          <p className="text-muted-foreground">
            Add a new promotional banner for the homepage jumbotron
          </p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Promo Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new marketing promotion
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the promotion"
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
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  placeholder="e.g., 1"
                  defaultValue={1}
                />
                <p className="text-muted-foreground text-xs">
                  Lower numbers appear first in the carousel
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerImage">
                  Banner Image <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                />
                <p className="text-muted-foreground text-xs">
                  Recommended size: 1200x400px (landscape format)
                </p>
              </div>

              {imagePreview && (
                <div className="space-y-2">
                  <Label>Image Preview</Label>
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
                <Button type="submit" disabled={createPromoMutation.isPending}>
                  {createPromoMutation.isPending
                    ? "Creating..."
                    : "Create Promo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
