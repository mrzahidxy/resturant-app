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
          className={`px-4 py-2 mx-1 border ${
            page === currentPage ? "bg-red-500 text-white" : "bg-gray-200"
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
