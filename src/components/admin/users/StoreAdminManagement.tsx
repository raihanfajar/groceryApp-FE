"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAddStoreAdmin } from "@/hooks/admin/store-admin-management/useAddStoreAdmin";
import { useDeleteStoreAdmin } from "@/hooks/admin/store-admin-management/useDeleteStoreAdmin";
import { useGetStoreAdmin } from "@/hooks/admin/store-admin-management/useGetStoreAdmin";
import { useGetStoreForDropdown } from "@/hooks/admin/store-admin-management/useGetStoreForDropdown";
import { useUpdateStoreAdmin } from "@/hooks/admin/store-admin-management/useUpdateStoreAdmin";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { AddStoreAdminDialog } from "./storeAdminManagement/AddStoreAdminDialog";
import { EditStoreAdminDialog } from "./storeAdminManagement/EditStoreAdminDialog";
import { StoreAdminTable } from "./storeAdminManagement/StoreAdminTable";
import { CreateStoreAdminData, StoreAdmin } from "./typesAndInterfaces";

export default function StoreAdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddStoreAdminDialogOpen, setIsAddStoreAdminDialogOpen] = useState(false); //prettier-ignore
  const [isEditStoreAdminDialogOpen, setIsEditStoreAdminDialogOpen] = useState(false); //prettier-ignore
  const [editingStoreAdmin, setEditingStoreAdmin] = useState<StoreAdmin | null>(null); //prettier-ignore
  const [createFormData, setCreateFormData] = useState<CreateStoreAdminData>({
    name: "",
    email: "",
    password: "",
    storeId: "",
  });
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    storeId: string;
  }>({
    name: "",
    email: "",
    storeId: "",
  });

  const { admin } = useAdminAuthStore();
  const queryClient = useQueryClient();

  // !Fetch store admins
  const { data: storeAdmins, isLoading: isLoadingAdmins } = useGetStoreAdmin(admin?.accessToken); //prettier-ignore
  // !Fetch stores for dropdown
  const { data: stores } = useGetStoreForDropdown(admin?.accessToken); //prettire-ignore
  // !Add store admin mutation
  const { mutate: addStoreAdmin, isPending: isAddingStoreAdmin } = useAddStoreAdmin(admin?.accessToken); //prettier-ignore
  // !Delete store admin mutation
  const { mutate: deleteStoreAdmin } = useDeleteStoreAdmin(admin?.accessToken);
  // !Update store admin mutation
  const { mutate: updateStoreAdmin, isPending: isUpdatingStoreAdmin } = useUpdateStoreAdmin(admin?.accessToken); //prettier-ignore

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    addStoreAdmin(createFormData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["storeAdmins"] });
        setIsAddStoreAdminDialogOpen(false);
        setCreateFormData({ name: "", email: "", password: "", storeId: "" });
      },
    });
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this store admin?")) {
      deleteStoreAdmin(adminId, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["storeAdmins"] }), //prettier-ignore
      });
    }
  };

  const handleEditAdmin = (storeAdmin: StoreAdmin) => {
    setEditingStoreAdmin(storeAdmin);
    setEditFormData({
      name: storeAdmin.name,
      email: storeAdmin.email,
      storeId: storeAdmin.store?.id || "",
    });
    setIsEditStoreAdminDialogOpen(true);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreAdmin) return;
    updateStoreAdmin(
      {
        adminId: editingStoreAdmin.id,
        data: editFormData,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["storeAdmins"] });
          setIsEditStoreAdminDialogOpen(false);
          setEditingStoreAdmin(null);
          setEditFormData({ name: "", email: "", storeId: "" });
        },
      },
    );
  };

  const filteredAdmins = (storeAdmins || []).filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.store?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.store?.province.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoadingAdmins) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading store admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search + Add Admin */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search store admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <AddStoreAdminDialog
          open={isAddStoreAdminDialogOpen}
          onOpenChange={setIsAddStoreAdminDialogOpen}
          stores={stores || []}
          formData={createFormData}
          setFormData={setCreateFormData}
          onSubmit={handleCreateAdmin}
          isSubmitting={isAddingStoreAdmin}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Store Administrators ({filteredAdmins?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAdmins?.length ? (
            <StoreAdminTable
              admins={filteredAdmins}
              onEdit={handleEditAdmin}
              onDelete={handleDeleteAdmin}
            />
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No store admins. Get started by creating one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditStoreAdminDialog
        open={isEditStoreAdminDialogOpen}
        onOpenChange={setIsEditStoreAdminDialogOpen}
        stores={stores || []}
        formData={editFormData}
        setFormData={setEditFormData}
        onSubmit={handleUpdateAdmin}
        isSubmitting={isUpdatingStoreAdmin}
        editingStoreAdmin={editingStoreAdmin}
      />
    </div>
  );
}
