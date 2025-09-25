import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminProduct } from "@/types/admin/product";

interface ProductDetailsCardProps {
  product: AdminProduct;
}

export default function ProductDetailsCard({
  product,
}: ProductDetailsCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <p className="text-lg font-medium">{product.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>
          {product.description.includes("<") &&
          product.description.includes(">") ? (
            <div
              className="max-w-none text-gray-900 [&_br]:mb-2 [&_br]:block [&_em]:italic [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-gray-900">
              {product.description}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Price</label>
            <p className="text-xl font-bold text-green-600">
              {formatPrice(product.price)}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Weight</label>
            <p className="text-lg font-medium">{product.weight}g</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Category</label>
          <p className="text-lg font-medium">{product.category.name}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Slug</label>
          <p className="font-mono text-sm text-gray-700">{product.slug}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Created</label>
            <p className="text-sm text-gray-700">
              {new Date(product.createdAt).toLocaleDateString("id-ID", {
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
              {new Date(product.updatedAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
