"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Mail, MapPin, Pencil, Trash2 } from "lucide-react";
import { StoreAdmin } from "./typesAndInterfaces";

interface StoreAdminTableProps {
  admins: StoreAdmin[];
  onEdit: (admin: StoreAdmin) => void;
  onDelete: (id: string) => void;
}

export function StoreAdminTable({
  admins,
  onEdit,
  onDelete,
}: StoreAdminTableProps) {
  return (
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
        {admins.map((storeAdmin) => (
          <TableRow key={storeAdmin.id}>
            <TableCell className="font-medium">{storeAdmin.name}</TableCell>
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
                  onClick={() => onEdit(storeAdmin)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(storeAdmin.id)}
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
  );
}
