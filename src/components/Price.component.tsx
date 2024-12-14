"use client";

import { TProduct } from "@/types/product";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";

const Price = ({ product }: { product: TProduct }) => {
  const { addToCart } = useCartStore();
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (product.options.length > 0) {
      const basePrice = parseInt(product.price) || 0;
      const additionalPrice =
        parseInt(product.options[selected]?.additionalPrice) || 0;
  
      setTotal(quantity * (basePrice + additionalPrice));
    } else {
      const basePrice = parseInt(product.price) || 0;
      setTotal(basePrice * quantity);
    }
  }, [quantity, selected, product]);
  

  const handleCart = () => {
    addToCart({
      id: product?.id,
      title: product?.title,
      img: product?.img,
      price: total,
      quantity: quantity,
      ...(product?.options?.length && {
        optionTitle: product.options[selected].title,
      }),
    });
  };



  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${product?.price}</h2>
      {/* OPTIONS */}
      <div className="flex gap-4">
        {!!product.options?.length &&
          product.options?.map((option, index) => (
            <button
              key={option.title}
              className={`${selected === index && "bg-red-500 text-white"} min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md`}
              onClick={() => setSelected(index)}
            >
              {option.title}
            </button>
          ))}
      </div>

      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full font-bold p-2 px-6 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="text-xl flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button
          className="uppercase font-bold w-56 bg-red-500 text-white p-3 ring-1 ring-red-500"
          onClick={handleCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
