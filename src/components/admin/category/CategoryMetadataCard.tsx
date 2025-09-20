import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Hash } from "lucide-react";
import { AdminProductCategory } from "@/types/admin/product";

interface CategoryMetadataCardProps {
  category: AdminProductCategory;
}

export default function CategoryMetadataCard({
  category,
}: CategoryMetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Category ID
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-sm text-gray-700">
              {category.id}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Created</label>
          <p className="text-sm text-gray-700">
            {new Date(category.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Last Updated
          </label>
          <p className="text-sm text-gray-700">
            {new Date(category.updatedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
