import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ProductCreateHeader: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/admin/products">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>
    </div>
  );
};

export default ProductCreateHeader;
