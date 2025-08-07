import React from 'react';
import { Button } from '../ui/button';

interface PaginationProps {
  handlePrevPage: () => void;
  handleNextPage: () => void;
  page: number;
  totalPages: number;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isFetching: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  handlePrevPage,
  handleNextPage,
  page,
  totalPages,
  isPreviousDisabled,
  isNextDisabled,
  isFetching,
}) => {
  return (
    <div className="flex justify-center items-center mt-8 gap-4">
      <Button
        variant="outline"
        onClick={handlePrevPage}
        disabled={isPreviousDisabled || isFetching}
        className="disabled:opacity-50"
      >
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={handleNextPage}
        disabled={isNextDisabled || isFetching}
        className="disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;