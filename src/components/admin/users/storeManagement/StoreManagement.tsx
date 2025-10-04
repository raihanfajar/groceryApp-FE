"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAddStore } from "@/hooks/admin/store-admin-management/useAddStore";
import { useGetAllStore } from "@/hooks/admin/store-admin-management/useGetAllStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Search } from "lucide-react";
import { useState } from "react";
import { DetailedStoreInfo } from "../typesAndInterfaces";
import { AddStoreDialog } from "./AddStoreDialog";
import { EditStoreDialog } from "./EditStoreDialog";
import { StoreTable } from "./StoreTable";

export interface Store {
  id: string;
  name: string;
  city: string;
  province: string;
  createdAt: string;
}

export default function StoreManagement() {
  // !Initialization and states setup
  const { admin } = useAdminAuthStore();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<DetailedStoreInfo | null>(
    null,
  );
  const formData = { name: "", province: "", city: "", district: "", lat: "", lng: "", provinceId: "", cityId: "", districtId: ""}; //prettier-ignore
  const [addForm, setAddForm] = useState(formData);
  const [editForm, setEditForm] = useState(formData);

  // !Hooks
  const { data: stores = [] } = useGetAllStore(admin?.accessToken);
  const { mutateAsync: addStore, isPending: isAddingStore } = useAddStore(admin?.accessToken); //prettier-ignore

  // !Filtration
  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.province.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // !Pagination
  const PAGE_SIZE = 5;
  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useState(() => setPage(1)); // reset on search change (lazy)

  // !Handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ADD store", addForm);
    addStore(addForm);
    setIsAddOpen(false);
    setAddForm(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("EDIT store", editForm);
    setIsEditOpen(false);
    setEditingStore(null);
  };

  const handleEdit = (store: DetailedStoreInfo) => {
    setEditingStore(store);
    setEditForm({
      name: store.name,
      province: store.province,
      city: store.city,
      district: store.district,
      lat: store.lat,
      lng: store.lng,
      provinceId: String(store.provinceId),
      cityId: String(store.cityId),
      districtId: String(store.districtId),
    });
    setIsEditOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this store?")) console.log("DELETE store", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddStoreDialog
          open={isAddOpen}
          onOpenChange={setIsAddOpen}
          formData={addForm}
          setFormData={setAddForm}
          onSubmit={handleAddSubmit}
          isAdding={isAddingStore}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stores ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {paginated.length ? (
            <>
              <StoreTable
                stores={paginated}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {/* simple footer */}
              <div className="flex items-center justify-between border-t px-6 py-3 text-sm">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span>
                  Page {page} of {pageCount}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No stores.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditStoreDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleEditSubmit}
        editingStore={editingStore}
      />
    </div>
  );
}
