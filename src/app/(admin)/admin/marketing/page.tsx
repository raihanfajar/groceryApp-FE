"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { handleApiError } from "@/utils/errorHandler";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MarketingPromo {
  id: string;
  name: string;
  description: string | null;
  bannerImageUrl: string | null;
  displayOrder: number | null;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function MarketingPromosPage() {
  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  // Fetch all marketing promos
  const { data: promos, isLoading } = useQuery({
    queryKey: ["marketing-promos", "admin"],
    queryFn: async () => {
      const response = await axiosInstance.get("/discounts/marketing-promos");
      return (response.data as { data: MarketingPromo[] }).data;
    },
  });

  // Delete promo mutation
  const deletePromoMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/discounts/marketing-promos/${id}`);
    },
    onSuccess: () => {
      toast.success("Marketing promo deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["marketing-promos"] });
    },
    onError: (error: unknown) => {
      const errorMessage = handleApiError(
        error,
        "Failed to delete marketing promo",
      );
      toast.error(errorMessage);
    },
  });

  const isPromoActive = (promo: MarketingPromo): boolean => {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    return promo.isActive && start <= now && now <= end;
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
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Marketing Promotions
            </h1>
            <p className="text-muted-foreground">
              Manage promotional banners for the homepage jumbotron
            </p>
          </div>
          <Link href="/admin/marketing/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Promo
            </Button>
          </Link>
        </div>

        {/* Promos Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-muted-foreground">Loading promotions...</div>
          </div>
        ) : !promos || promos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground mb-4">
                No marketing promotions yet
              </p>
              <Link href="/admin/marketing/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Promo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promos
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((promo) => (
                <Card key={promo.id} className="overflow-hidden">
                  {/* Image */}
                  {promo.bannerImageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={promo.bannerImageUrl}
                        alt={promo.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">
                          {promo.name}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">
                          {promo.description || "No description"}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={isPromoActive(promo) ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {isPromoActive(promo) ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Details */}
                    <div className="text-muted-foreground space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Period:</span>{" "}
                        {format(new Date(promo.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(promo.endDate), "MMM dd, yyyy")}
                      </div>
                      <div>
                        <span className="font-medium">Display Order:</span>{" "}
                        {promo.displayOrder || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {format(
                          new Date(promo.updatedAt),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/marketing/edit/${promo.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Promo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{promo.name}
                              &quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                deletePromoMutation.mutate(promo.id)
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
