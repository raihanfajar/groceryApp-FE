"use client";

import { Button } from "@/components/ui/button";

interface PaginationFooterProps {
  page: number;
  pageCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationFooter({
  page,
  pageCount,
  onPrev,
  onNext,
}: PaginationFooterProps) {
  if (pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t px-6 py-3 text-sm">
      <Button
        size="sm"
        variant="outline"
        onClick={onPrev}
        disabled={page === 1}
      >
        Prev
      </Button>

      <span className="text-gray-600">
        Page {page} of {pageCount}
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={onNext}
        disabled={page === pageCount}
      >
        Next
      </Button>
    </div>
  );
}
