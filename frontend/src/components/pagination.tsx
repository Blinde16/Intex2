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
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(safePageCount - 1, currentPage + 2);

    pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < safePageCount - 1) pages.push("...");
    if (safePageCount > 1) pages.push(safePageCount);

    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-4 gap-2 flex-wrap">
      {/* Previous (jump 5 pages back) */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 5))}
        className="px-2 py-1 border rounded"
      >
        Previous
      </button>

      {/* Page number buttons */}
      {getPagesToShow().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            disabled={currentPage === page}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next (jump 5 pages forward) */}
      <button
        disabled={currentPage === safePageCount}
        onClick={() =>
          onPageChange(Math.min(safePageCount, currentPage + 5))
        }
        className="px-2 py-1 border rounded"
      >
        Next
      </button>

      {/* Page size dropdown */}
      <label className="ml-4 text-sm">
        Items per page:{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            onPageSizeChange(newSize);
            onPageChange(1); // Reset to page 1 when page size changes
          }}
          className="ml-2 border rounded px-1 py-0.5"
        >
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
        </select>
      </label>
    </div>
  );
};

export default Pagination;


