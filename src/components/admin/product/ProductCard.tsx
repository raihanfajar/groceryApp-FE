import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: AdminProduct;
  isSuper: boolean;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSuper,
  onDelete,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-square">
        {product.picture1 ? (
          <Image
            src={product.picture1}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        )}
        <div className="absolute top-1 right-1">
          <Badge
            variant={product.isActive ? "default" : "secondary"}
            className="px-1.5 py-0.5 text-[10px]"
          >
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-1.5 p-2">
        <h3
          className="truncate text-sm font-medium text-gray-900"
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-green-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-500">{product.weight}g</span>
        </div>

        <p
          className="truncate text-xs text-gray-500"
          title={product.category.name}
        >
          {product.category.name}
        </p>

        <div className="flex gap-1 pt-1">
          <Link href={`/admin/products/${product.slug}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-full px-1 text-xs"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </Link>

          {isSuper && (
            <>
              <Link
                href={`/admin/products/${product.slug}/edit`}
                className="flex-1"
              >
                <Button size="sm" className="h-7 w-full px-1 text-xs">
                  <Edit className="h-3 w-3" />
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                className="h-7 px-2"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
