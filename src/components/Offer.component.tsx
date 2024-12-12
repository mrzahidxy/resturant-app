import Image from "next/image";
import Countdown from "./Countdown.component";

type Props = {};

const Offer = (props: Props) => {
  return (
    <div className="bg-black bg-[url('/offerBg.png')] bg-cover bg-center h-screen flex flex-col md:flex-row md:h-[70vh]">
      {/* Text Container */}
      <div className="flex-1 text-white flex flex-col gap-6 justify-center items-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Delicious Burger & Fry
        </h1>
        <p className="text-sm md:text-lg text-gray-300 max-w-md">
          Progressively simplify effective e-toilers and process-centric methods
          of empowerment. Quickly pontificate parallel.
        </p>

        <Countdown startDate="12/25/2024" />

        <button className="bg-red-500 px-6 py-3 rounded-md text-lg md:text-xl font-medium hover:bg-red-600 transition">
          Order Now
        </button>
      </div>

      {/* Image Container */}
      <div className="flex-1 relative">
        <Image
          src="/offerProduct.png"
          alt="Special offer on burger and fries"
          fill
          loading="lazy"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Offer;
