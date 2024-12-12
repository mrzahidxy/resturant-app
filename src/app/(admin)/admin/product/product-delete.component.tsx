"use client";

import { useState } from "react";

const ProductDelete = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
      onClick={() => handleDelete(id)}
      disabled={isLoading}
    >
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default ProductDelete;
