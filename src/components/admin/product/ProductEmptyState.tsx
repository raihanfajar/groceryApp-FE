import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

interface ProductEmptyStateProps {
  isSuper: boolean;
}

const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ isSuper }) => {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-600">No products found</p>
        {isSuper && (
          <Link href="/admin/products/create">
            <Button className="mt-4">Create your first product</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductEmptyState;
