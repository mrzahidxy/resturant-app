import { pizzas } from "@/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Products = (props: Props) => {
  return (
    <div className="flex flex-wrap px-8">
      {pizzas?.map((product) => (
        <Link href={"#"} className="w-full md:w-1/2 lg:w-1/4 h-[60vh] group">
          <div className="relative h-[60%]">
            {product?.img && (
              <Image
                src="/temporary/p1.png"
                alt={product?.title}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-xl font-bold text-red-500">
              {product?.title}
            </span>
            <div className="flex flex-col font-lg">
              <span className="group-hover:hidden font-bold text-red-500">{product?.price}</span>
              <button className="bg-red-500 text-white p-2 rounded-sm hidden group-hover:block">
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products;
