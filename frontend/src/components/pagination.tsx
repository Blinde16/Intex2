interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const safePageCount = Math.max(1, totalPages || 1);

  const getPagesToShow = () => {
    const pages: (number | string)[] = [];

    if (safePageCount <= 5) {
      for (let i = 1; i <= safePageCount; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(safePageCount, currentPage + 2);

      if (currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentPage >= safePageCount - 2) {
        start = safePageCount - 4;
        end = safePageCount;
      }

      if (start > 1) {
        pages.push(1, "...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < safePageCount) {
        pages.push("...", safePageCount);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center mt-4 gap-2 text-sm">
      {/* Previous Page */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1 border rounded"
      >
        ◀ Prev
      </button>

      {/* Page Number Buttons */}
      {getPagesToShow().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            disabled={currentPage === page}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Page */}
      <button
        onClick={() => onPageChange(Math.min(safePageCount, currentPage + 1))}
        disabled={currentPage === safePageCount}
        className="px-2 py-1 border rounded"
      >
        Next ▶
      </button>

      {/* Page Size Selector */}
      <div className="ml-4">
        <label className="mr-2">Items per page:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // reset to first page
          }}
          className="border rounded px-1 py-0.5"
        >
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
