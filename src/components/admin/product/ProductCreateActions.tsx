import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductCreateActionsProps {
  loading: boolean;
}

const ProductCreateActions: React.FC<ProductCreateActionsProps> = ({
  loading,
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Link href="/admin/products">
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </Link>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Product"}
      </Button>
    </div>
  );
};

export default ProductCreateActions;
