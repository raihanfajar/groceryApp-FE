import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { AdminProductCategory } from "@/types/admin/product";
import Link from "next/link";

interface CategoryStatsCardProps {
  category: AdminProductCategory;
}

export default function CategoryStatsCard({
  category,
}: CategoryStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Products</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {category._count?.products || 0}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Products in this category
          </p>
          {category._count?.products && category._count.products > 0 && (
            <Link href={`/admin/products?categoryId=${category.id}`}>
              <Button variant="outline" size="sm" className="mt-3">
                View Products
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
