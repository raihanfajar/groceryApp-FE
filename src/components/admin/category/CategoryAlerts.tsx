import { Card, CardContent } from "@/components/ui/card";
import { AdminProductCategory } from "@/types/admin/product";
import Link from "next/link";

interface CategoryAlertsProps {
  category: AdminProductCategory;
  isSuper: boolean;
}

export default function CategoryAlerts({
  category,
  isSuper,
}: CategoryAlertsProps) {
  return (
    <>
      {/* Inactive Category Alert */}
      {!category.isActive && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <p className="text-sm text-orange-800">
                This category is currently inactive and won&apos;t be visible to
                customers. Products in this category may also be affected.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty Category Alert */}
      {category._count?.products === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <p className="text-sm text-blue-800">
                This category doesn&apos;t have any products yet.
                {isSuper && (
                  <>
                    {" "}
                    You can{" "}
                    <Link
                      href="/admin/products/create"
                      className="font-medium underline"
                    >
                      create a new product
                    </Link>{" "}
                    and assign it to this category.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
