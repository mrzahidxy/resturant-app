import { TProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";


type Props = {};

const getData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true`, {
    cache: "no-store",
  });

  if (!res?.ok) {
    return null;
  }

  const data = (await res.json()) || [];
  return data;
};

const Featured = async (props: Props) => {

  const featuredProducts = await getData()

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold">No featured products found</h1>
      </div>
    );
  }

  return (
    <div className="overflow-x-scroll custom-scroll">
      <div className="w-max flex">
        {featuredProducts.map((product:TProduct) => (
          <Link href={`/product/${product?.id}`} key={product?.id} className="w-screen h-[60vh] m-2 flex flex-col xl:w-[33vw] justify-around items-center lg:w-[33vw] hover:bg-fuchsia-50 transition-all duration-300">
            <div className="relative w-full flex-1">
              <Image
                src={product?.img ?? "/no-image-found.jpg"}
                alt="product"
                fill
                className="object-contain hover:rotate-45 transition-all duration-300"
              />
            </div>
            <div className="flex-1 text-red-500 flex flex-col items-center gap-4">
              <h2 className="text-3xl font-bold">{product?.title ?? "Unnamed Product"}</h2>
              <p className="p-4">{product?.desc}</p>
              <span className="font-bold text-2xl">{product?.price}</span>
              <div className="bg-red-500 text-white px-4 py-2 rounded-md">
                Add to cart
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Featured;
