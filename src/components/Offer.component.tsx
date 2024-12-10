import Image from "next/image";
import React from "react";
import Countdown from "./Countdown.component";

type Props = {};

const Offer = (props: Props) => {
  return (
    <div className="bg-black bg-[url('/offerBg.png')] h-screen flex flex-col md:flex-row  md:h-[70vh]">
      {/* Text Container */}
      <div className="flex-1 text-white flex flex-col gap-4 justify-center items-center px-2 text-center">
        <h1 className="text-4xl md:text-7xl font-bold ">
          Delicious Burger & Fry
        </h1>
        <p>
          Progressively simplify effective e-toilers and process-centric methods
          of empowerment. Quickly pontificate parallel.
        </p>

        <Countdown startDate="12/25/2024" />
        <button className="bg-red-500 px-4 py-2 rounded-md text-2xl">Order Now</button>
      </div>

      {/* Image Container */}
      <div className="flex-1 relative ">
        <Image src="/offerProduct.png" fill alt="offer" />
      </div>
    </div>
  );
};

export default Offer;
