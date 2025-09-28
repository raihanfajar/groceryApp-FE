"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Mail, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { toast } from "react-toastify";

interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
}

interface StoreAdmin {
  id: string;
  name: string;
  email: string;
  isSuper: boolean;
  storeId: string | null;
  store: Store | null;
  createdAt: string;
}

interface CreateStoreAdminData {
  name: string;
  email: string;
  password: string;
  storeId: string;
}

export default function StoreAdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<StoreAdmin | null>(null);
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

  // Fetch store admins
  const { data: storeAdmins, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["storeAdmins"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/store-admins", {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      console.log("Store admins response:", response.data);
      const data = (
        response.data as { data: { admins: StoreAdmin[]; count: number } }
      ).data;
      return Array.isArray(data.admins) ? data.admins : [];
    },
    enabled: !!admin?.accessToken,
  });

  // Fetch stores for dropdown
  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/stores", {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      console.log("Stores response:", response.data);
      const data = (response.data as { data: Store[] }).data;
      return Array.isArray(data) ? data : [];
    },
    enabled: !!admin?.accessToken,
  }); // Create store admin mutation
  const createAdminMutation = useMutation({
    mutationFn: async (data: CreateStoreAdminData) => {
      const response = await axiosInstance.post("/admin/store-admins", data, {
        headers: { Authorization: `Bearer ${admin?.accessToken}` },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Store admin created successfully");
      queryClient.invalidateQueries({ queryKey: ["storeAdmins"] });
      setIsCreateDialogOpen(false);
      setCreateFormData({ name: "", email: "", password: "", storeId: "" });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      alert("Error creating store admin: " + errorMessage);
    },
  });

  // Delete store admin mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId: string) => {
      const response = await axiosInstance.delete(
        `/admin/store-admins/${adminId}`,
        {
          headers: { Authorization: `Bearer ${admin?.accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Store admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["storeAdmins"] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete store admin";
      toast.error(errorMessage);
    },
  });

  // Update store admin mutation
  const updateAdminMutation = useMutation({
    mutationFn: async ({
      adminId,
      data,
    }: {
      adminId: string;
      data: { name: string; email: string; storeId: string };
    }) => {
      const response = await axiosInstance.put(
        `/admin/store-admins/${adminId}`,
        data,
        {
          headers: { Authorization: `Bearer ${admin?.accessToken}` },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Store admin updated successfully");
      queryClient.invalidateQueries({ queryKey: ["storeAdmins"] });
      setIsEditDialogOpen(false);
      setEditingAdmin(null);
      setEditFormData({ name: "", email: "", storeId: "" });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update store admin";
      toast.error(errorMessage);
    },
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(createFormData);
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this store admin?")) {
      deleteAdminMutation.mutate(adminId);
    }
  };

  const handleEditAdmin = (storeAdmin: StoreAdmin) => {
    setEditingAdmin(storeAdmin);
    setEditFormData({
      name: storeAdmin.name,
      email: storeAdmin.email,
      storeId: storeAdmin.store?.id || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    updateAdminMutation.mutate({
      adminId: editingAdmin.id,
      data: editFormData,
    });
  };

  const filteredAdmins = (storeAdmins || []).filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.store?.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      {/* Header Actions */}
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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Store Admin</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateAdmin}>
              <DialogHeader>
                <DialogTitle>Create New Store Admin</DialogTitle>
                <DialogDescription>
                  Create a new store administrator account. They will be able to
                  manage their assigned store.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={createFormData.name}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={createFormData.email}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={createFormData.password}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        password: e.target.value,
                      })
                    }
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="store">Assign Store</Label>
                  <Select
                    value={createFormData.storeId}
                    onValueChange={(value) =>
                      setCreateFormData({ ...createFormData, storeId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a store" />
                    </SelectTrigger>
                    <SelectContent>
                      {(stores || []).map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name} - {store.city}, {store.province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createAdminMutation.isPending}>
                  {createAdminMutation.isPending
                    ? "Creating..."
                    : "Create Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Store Admin Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Store Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-store">Store</Label>
                <Select
                  value={editFormData.storeId}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, storeId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {(stores || []).map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.name} - {store.city}, {store.province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAdminMutation.isPending}>
                  {updateAdminMutation.isPending
                    ? "Updating..."
                    : "Update Admin"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Store Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Store Administrators ({filteredAdmins?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAdmins && filteredAdmins.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((storeAdmin) => (
                  <TableRow key={storeAdmin.id}>
                    <TableCell className="font-medium">
                      {storeAdmin.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{storeAdmin.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {storeAdmin.store ? (
                        <Badge variant="outline">{storeAdmin.store.name}</Badge>
                      ) : (
                        <Badge variant="secondary">No Store</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {storeAdmin.store && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {storeAdmin.store.city}, {storeAdmin.store.province}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(storeAdmin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAdmin(storeAdmin)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteAdmin(storeAdmin.id)}
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
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No store admins
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new store administrator.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
