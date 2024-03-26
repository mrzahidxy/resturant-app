import { TProduct } from "@/types/product";
import Image from "next/image";


type Props = {};

const getData = async () => {
  const res = await fetch(
    `http://localhost:3000/api/products`,
    {
      cache: "no-store",
    }
  );

  if (!res?.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = res.json() || [];
  return data;
};

const Featured = async (props: Props) => {

  const featuredProducts = await getData()
  return (
    <div className="overflow-x-scroll custom-scroll">
      <div className="w-max flex">
        {featuredProducts.map((product:TProduct) => (
          <div key={product?.id} className="w-screen h-[60vh] m-2 flex flex-col xl:w-[33vw] justify-around items-center lg:w-[33vw] hover:bg-fuchsia-50 transition-all duration-300">
            <div className="relative w-full flex-1">
              <Image
                src={product?.img ?? ""}
                alt="product"
                fill
                className="object-contain hover:rotate-45 transition-all duration-300"
              />
            </div>
            <div className="flex-1 text-red-500 flex flex-col items-center gap-4">
              <h2 className="text-3xl font-bold">{product?.title}</h2>
              <p className="p-4">{product?.desc}</p>
              <span className="font-bold text-2xl">{product?.price}</span>
              <div className="bg-red-500 text-white px-4 py-2 rounded-md">
                Add to cart
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
