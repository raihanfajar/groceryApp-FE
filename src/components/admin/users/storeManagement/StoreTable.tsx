"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import ConfirmDialog from "../ConfirmDialog";
import { DetailedStoreInfo } from "../typesAndInterfaces";

interface StoreTableProps {
  stores: DetailedStoreInfo[];
  onEdit: (store: DetailedStoreInfo) => void;
  onDelete: (id: string) => void;
}

export function StoreTable({ stores, onEdit, onDelete }: StoreTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>City</TableHead>
          <TableHead>Province</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stores.map((store) => (
          <TableRow key={store.id}>
            <TableCell className="font-medium">{store.name}</TableCell>
            <TableCell>{store.city}</TableCell>
            <TableCell>{store.province}</TableCell>
            <TableCell className="text-sm text-gray-600">
              {new Date(store.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(store)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <ConfirmDialog
                  dialogTitle="Are you sure you want to delete this store?"
                  dialogDescription="Make sure no store admin assigned to this store. Once deleted, store can't be restored."
                  onConfirm={() => onDelete(store.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
