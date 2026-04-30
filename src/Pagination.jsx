import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const windowSize = 1; // how many pages around current

    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);

    // Always include first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always include last page
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-between mt-4 text-sm text-neutral-400 flex-wrap gap-2">
      {/* Left */}
      <p>
        Page {currentPage} of {totalPages}
      </p>

      {/* Right */}
      <div className="flex gap-2 flex-wrap">
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === 1
              ? "border-neutral-700 text-neutral-500 cursor-not-allowed"
              : "border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white"
          }`}
        >
          Prev
        </button>

        {/* Pages */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2 text-neutral-500">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-lg border transition ${
                currentPage === p
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "border-neutral-700 text-indigo-300 hover:bg-indigo-500 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`px-3 py-1 rounded-lg border transition ${
            currentPage === totalPages
              ? "border-neutral-700 text-neutral-500 cursor-not-allowed"
              : "border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

{/* <Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(p) => setPage(p)}
/> */}