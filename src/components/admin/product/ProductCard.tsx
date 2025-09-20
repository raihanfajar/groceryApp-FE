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
    <Card className="overflow-hidden">
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
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={product.isActive ? "default" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="truncate font-medium text-gray-900">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500">{product.weight}g</span>
          </div>
          <div className="text-sm text-gray-500">
            Category: {product.category.name}
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Link href={`/admin/products/${product.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </Link>

          {isSuper && (
            <>
              <Link
                href={`/admin/products/${product.slug}/edit`}
                className="flex-1"
              >
                <Button size="sm" className="w-full">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
