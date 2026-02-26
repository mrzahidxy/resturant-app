"use client";


import { useRouter } from "next/navigation";
import { useState } from "react";

type PaginationProps = {
  totalPages: number;
  initialPage: number;
};

const Pagination = ({ totalPages, initialPage }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const { push } = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    push(`?page=${page}`);
  };

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`ui-btn ui-btn-sm mx-1 min-w-10 ${
            page === currentPage ? "ui-btn-primary" : "ui-btn-secondary"
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
