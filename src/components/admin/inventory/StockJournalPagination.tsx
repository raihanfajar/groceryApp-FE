import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface StockJournalPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const StockJournalPagination: React.FC<StockJournalPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className="h-8 w-8 p-0"
        >
          {i}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
      <div className="flex items-center text-sm text-gray-600">
        Showing {startItem} to {endItem} of {total} stock movements
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPageButtons()}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StockJournalPagination;
