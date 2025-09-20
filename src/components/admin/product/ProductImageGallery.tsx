import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminProduct } from "@/types/admin/product";
import { Package } from "lucide-react";
import Image from "next/image";

interface ProductImageGalleryProps {
  product: AdminProduct;
}

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  const images = [
    product.picture1,
    product.picture2,
    product.picture3,
    product.picture4,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {images.map((picture, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={picture!}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-2 flex h-48 items-center justify-center rounded-lg bg-gray-100">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
