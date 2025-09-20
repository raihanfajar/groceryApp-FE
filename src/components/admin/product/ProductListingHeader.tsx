import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface ProductListingHeaderProps {
  isSuper: boolean;
  storeName?: string;
}

const ProductListingHeader: React.FC<ProductListingHeaderProps> = ({
  isSuper,
  storeName,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600">
          {isSuper
            ? "Manage products across all stores"
            : `Manage products for ${storeName}`}
        </p>
      </div>
      {isSuper && (
        <Link href="/admin/products/create">
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ProductListingHeader;
