import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface ProductViewHeaderProps {
  product: AdminProduct;
  isSuper: boolean;
}

export default function ProductViewHeader({
  product,
  isSuper,
}: ProductViewHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">{product.category.name}</p>
        </div>
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {isSuper && (
        <Link href={`/admin/products/${product.slug}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      )}
    </div>
  );
}
