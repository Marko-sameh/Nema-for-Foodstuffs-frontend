import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8"
      >
        <ChevronLeft className="h-4 w-4 rtl:hidden" />
        <ChevronRight className="h-4 w-4 hidden rtl:block" />
        <span className="sr-only">Previous</span>
      </Button>

      {getPages().map((p, i) => (
        p === '...' ? (
          <div key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        ) : (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(p as number)}
            className="w-8 h-8"
          >
            {p}
          </Button>
        )
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8"
      >
        <ChevronRight className="h-4 w-4 rtl:hidden" />
        <ChevronLeft className="h-4 w-4 hidden rtl:block" />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  );
}
