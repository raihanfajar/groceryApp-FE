import { Package, Search } from "lucide-react";

const StockEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <Package className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No products found
      </h3>
      <p className="mb-6 max-w-md text-gray-600">
        No products match your current filters. Try adjusting your search
        criteria or clearing the filters.
      </p>
      <div className="flex items-center text-sm text-gray-500">
        <Search className="mr-2 h-4 w-4" />
        Try searching for a different product name or category
      </div>
    </div>
  );
};

export default StockEmptyState;
