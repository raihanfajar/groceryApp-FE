import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminProduct } from "@/types/admin/product";
import { Eye, Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductListRowProps {
  product: AdminProduct;
  isSuper: boolean;
  onDelete: (id: string) => void;
}

const ProductListRow: React.FC<ProductListRowProps> = ({
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
    <div className="flex items-center gap-2 overflow-hidden rounded-lg border bg-white p-3 transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
      {/* Product Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-20">
        {product.picture1 ? (
          <Image
            src={product.picture1}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <Package className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-4">
        {/* Name & Description */}
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-sm font-medium text-gray-900 sm:text-base"
            title={product.name}
          >
            {product.name}
          </h3>
          {product.description.includes("<") &&
          product.description.includes(">") ? (
            <div
              className="line-clamp-1 text-xs text-gray-600 sm:text-sm [&_em]:italic [&_ol]:list-decimal [&_strong]:font-bold [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="line-clamp-1 text-xs text-gray-600 sm:text-sm">
              {product.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="hidden w-24 flex-shrink-0 lg:block xl:w-32">
          <p
            className="truncate text-sm text-gray-600"
            title={product.category.name}
          >
            {product.category.name}
          </p>
        </div>

        {/* Price */}
        <div className="w-20 flex-shrink-0 sm:w-28">
          <p className="truncate text-sm font-bold text-green-600 sm:text-base">
            {formatPrice(product.price)}
          </p>
          <p className="text-xs text-gray-500">{product.weight}g</p>
        </div>

        {/* Status */}
        <div className="hidden w-16 flex-shrink-0 md:block xl:w-20">
          <Badge
            variant={product.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 gap-1 sm:gap-2">
          <Link href={`/admin/products/${product.slug}`}>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {isSuper && (
            <>
              <Link href={`/admin/products/${product.slug}/edit`}>
                <Button size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListRow;
