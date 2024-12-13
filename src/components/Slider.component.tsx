"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

type Tdata = {
  id: number;
  title: string;
  image: string;
};

type Props = {};

const slides: Tdata[] = [
  {
    id: 1,
    title: "Always fresh & always crispy & always hot",
    image: "/slide1.png",
  },
  {
    id: 2,
    title: "We deliver your order wherever you are in NY",
    image: "/slide2.png",
  },
  {
    id: 3,
    title: "The best pizza to share with your family",
    image: "/slide3.jpg",
  },
];

const Slider = (props: Props) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] lg:h-[calc(100vh-7rem)] bg-fuchsia-50 lg:flex-row">
      {/* Text Section */}
      <div className="flex-1 flex flex-col gap-12 justify-center text-center font-bold px-6">
        <h1 className="text-3xl lg:text-7xl capitalize text-red-600">
          {slides[currentSlide]?.title}
        </h1>
        <div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Order Now
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex-1 relative">
        <Image
          src={slides[currentSlide]?.image}
          alt={slides[currentSlide]?.title || "Slide Image"}
          fill
          className="object-cover z-0"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Slider;
