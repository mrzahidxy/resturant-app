import { TProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { category: string };
};

const getData = async (category: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?cat=${category}`,
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

const Products = async ({ params }: Props) => {
  const products = await getData(params?.category);

  return (
    <div className="flex flex-wrap px-6 py-2 gap-1">
      {products?.map((product: TProduct) => (
        <Link href={`/product/${product?.id}`} key={product?.id} className="w-full md:w-1/2 lg:w-1/4 h-[50vh] flex flex-col justify-between shadow p-4 group">
          <div className="relative h-[80%]">
            {product?.img && (
              <Image
                src={product?.img}
                alt={product?.title}
                fill
                className="object-contain"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-2xl font-bold text-red-500">
              {product?.title}
            </span>
            <div className="flex flex-col font-lg">
              <span className="group-hover:hidden font-bold p-2 text-red-500">
                {product?.price}
              </span>
              <span className="bg-red-500 text-white p-2 rounded-sm hidden group-hover:block cursor-pointer">
                Add to Cart
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Products;
