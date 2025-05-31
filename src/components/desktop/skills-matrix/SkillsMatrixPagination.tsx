
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SkillsMatrixPaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

export const SkillsMatrixPagination = ({
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange
}: SkillsMatrixPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious}
        className="flex items-center space-x-1"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span>Previous</span>
      </Button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="flex items-center space-x-1"
      >
        <span>Next</span>
        <ChevronRightIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
