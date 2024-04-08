"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Tdata = {
  id: number;
  title: string;
  image: string;
};

type Props = {};

const data: Tdata[] = [
  {
    id: 1,
    title: "always fresh & always crispy & always hot",
    image: "/slide1.png",
  },
  {
    id: 2,
    title: "we deliver your order wherever you are in NY",
    image: "/slide2.png",
  },
  {
    id: 3,
    title: "the best pizza to share with your family",
    image: "/slide3.jpg",
  },
];

const Slider = (props: Props) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev: number) => (prev > 1 ? 0 : prev + 1)),
      5000
    );
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-fuchsia-50 lg:h-[calc(100vh-7rem)] lg:flex-row">
      <div className="flex-1 flex flex-col gap-12 justify-center text-center font-bold">
        <h1 className="text-3xl lg:text-7xl capitalize text-red-600">
          {data[currentSlide]?.title}
        </h1>
        <div>
          <button className="bg-red-600 text-white px-4 py-2">Order Now</button>
        </div>
      </div>
      <div className="flex-1 relative">
        <Image
          src={data[currentSlide]?.image}
          alt=""
          fill
          className="object-cover z-0"
        />
      </div>
    </div>
  );
};

export default Slider;
