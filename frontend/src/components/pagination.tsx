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

  return (
    <div className="flex items-center justify-center mt-4 gap-2 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {Array.from({ length: safePageCount }).map((_, index) => (
        <button
          onClick={() => onPageChange(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={currentPage === safePageCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>

      <label className="ml-4">
        Items per page:{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            onPageSizeChange(newSize);
            onPageChange(1); // reset to page 1 when page size changes
          }}
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
