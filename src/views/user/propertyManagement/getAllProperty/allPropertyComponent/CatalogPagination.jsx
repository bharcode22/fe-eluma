import React from 'react';
import { ChevronFirst, ChevronLeft, ChevronRight, ChevronLast } from 'lucide-react';

export const CatalogPagination = ({
  paginationInfo,
  currentPage,
  pageNumbers,
  onPageChange
}) => {
  if (!paginationInfo || paginationInfo.totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-base-300">
      <div className="text-xs text-base-content/70">
        Showing Page <span className="font-bold text-base-content">{paginationInfo.currentPage}</span> of{' '}
        <span className="font-bold text-base-content">{paginationInfo.totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
          title="First Page"
        >
          <ChevronFirst className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!paginationInfo.hasPreviousPage}
          className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`btn btn-sm btn-circle text-xs font-semibold ${
                currentPage === pageNum
                  ? 'btn-primary text-white shadow-md'
                  : 'btn-ghost text-base-content/70 hover:bg-base-200'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!paginationInfo.hasNextPage}
          className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(paginationInfo.totalPages)}
          disabled={currentPage === paginationInfo.totalPages}
          className="btn btn-circle btn-sm btn-ghost disabled:opacity-30"
          title="Last Page"
        >
          <ChevronLast className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
