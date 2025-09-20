import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductFormActionsProps {
  saving: boolean;
}

export default function ProductFormActions({
  saving,
}: ProductFormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <Link href="/admin/products">
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </Link>
      <Button type="submit" disabled={saving}>
        {saving ? "Updating..." : "Update Product"}
      </Button>
    </div>
  );
}
