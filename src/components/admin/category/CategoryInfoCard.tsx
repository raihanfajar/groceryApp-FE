import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree } from "lucide-react";
import { AdminProductCategory } from "@/types/admin/product";

interface CategoryInfoCardProps {
  category: AdminProductCategory;
}

export default function CategoryInfoCard({ category }: CategoryInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FolderTree className="h-5 w-5" />
          <span>Category Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <p className="text-lg font-medium">{category.name}</p>
        </div>

        {category.description && (
          <div>
            <label className="text-sm font-medium text-gray-600">
              Description
            </label>
            <p className="text-gray-900">{category.description}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-600">Slug</label>
          <p className="font-mono text-sm text-gray-700">{category.slug}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <div className="mt-1">
            <Badge variant={category.isActive ? "default" : "secondary"}>
              {category.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
