"use client";

import { TProduct } from "@/types/product";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";

const Price = ({ product }: { product: TProduct }) => {
  const { addToCart } = useCartStore();
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (Array.isArray(product.options) && product.options.length > 0) {
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
      price: total,
      img: product?.img,
      quantity: quantity,
      ...(product?.options?.length && {
        optionTitle: product.options[selected].title,
      }),
    });

    setAdded(true);
  };

  useEffect(() => {
    if (!added) return;

    const timeout = setTimeout(() => setAdded(false), 1200);
    return () => clearTimeout(timeout);
  }, [added]);



  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="ui-muted text-xs font-semibold uppercase tracking-[0.2em]">
            Starting at
          </p>
          <h2 className="text-2xl font-bold text-[var(--lb-ink)]">${product?.price}</h2>
        </div>
      </div>
      {/* OPTIONS */}
      <div className="flex flex-wrap gap-3">
        {!!product.options?.length &&
          product.options?.map((option, index) => (
            <button
              key={option.title}
              className={`ui-btn min-w-[6rem] rounded-xl px-3 py-2 normal-case tracking-normal ring-1 ring-red-200 ${
                selected === index ? "ui-btn-primary ring-red-500" : "ui-btn-secondary"
              }`}
              onClick={() => setSelected(index)}
            >
              {option.title}
            </button>
          ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* QUANTITY */}
        <div className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-white p-2 px-4 font-bold shadow-sm lg:flex-1">
          <span>Quantity</span>
          <div className="text-xl flex gap-4 items-center">
            <button
              className="ui-btn ui-btn-ghost ui-btn-sm h-8 w-8 rounded-full p-0 text-lg"
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              className="ui-btn ui-btn-ghost ui-btn-sm h-8 w-8 rounded-full p-0 text-lg"
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button
          className={`ui-btn w-full rounded-xl py-3 lg:w-56 ${
            added ? "ui-btn-secondary" : "ui-btn-primary"
          }`}
          onClick={handleCart}
          aria-live="polite"
        >
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default Price;
