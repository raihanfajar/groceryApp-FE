import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoryEditHeader() {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/admin/products?tab=categories">
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-600">Update category information</p>
      </div>
    </div>
  );
}
