import Price from "@/components/Price.component";
import { TProduct } from "@/types/product";

import Image from "next/image";
import React from "react";

const getData = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  const singleProduct: TProduct = await getData(params.id);

  return (
    <div className="h-screen flex flex-col justify-around text-red-500 md:flex-row md:items-center">
      {/* IMAGE CONTAINER */}
      {singleProduct.img && (
        <div className="relative" style={{ width: 500, height: 500 }}>
          <Image
            src={singleProduct.img}
            alt=""
            className="object-contain"
            fill
          />
        </div>
      )}
      {/* TEXT CONTAINER */}
      <div className="" style={{ width: 600 }}>
        <h1 className="text-3xl font-bold uppercase">
          <span>{singleProduct.title}</span>
          {/* <DeleteButton id={singleProduct.id} /> */}
        </h1>
        <p>{singleProduct.desc}</p>
        <Price product={singleProduct} />
      </div>
    </div>
  );
};

export default SingleProductPage;
