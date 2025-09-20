import { AdminProductCategory } from "@/types/admin/product";

interface CategoryCurrentInfoProps {
  category: AdminProductCategory;
}

export default function CategoryCurrentInfo({
  category,
}: CategoryCurrentInfoProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h4 className="mb-2 text-sm font-medium text-gray-700">
        Current Information
      </h4>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-600">Created: </span>
          <span className="text-sm text-gray-900">
            {new Date(category.createdAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">
            Last Updated:{" "}
          </span>
          <span className="text-sm text-gray-900">
            {new Date(category.updatedAt).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Slug: </span>
          <span className="font-mono text-sm text-gray-700">
            {category.slug}
          </span>
        </div>
        {category._count && (
          <div>
            <span className="text-sm font-medium text-gray-600">
              Products:{" "}
            </span>
            <span className="text-sm text-gray-900">
              {category._count.products} products
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
