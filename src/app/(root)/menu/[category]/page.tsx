import { TProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: { category: string };
};

const getData = async (category: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?cat=${category}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return (await res.json()) || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const Products = async ({ params }: Props) => {
  const products = await getData(params?.category);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-500">
          No products available in this category.
        </h1>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: TProduct) => (
        <div key={product?.id} className="col-span-1">
          <Link
            href={`/product/${product?.id}`}
            className="w-full h-96 flex flex-col justify-between shadow-md p-4 group rounded-lg hover:shadow-lg transition-shadow duration-200"
          >
            {/* Product Image */}
            <div className="relative flex-1">
              {product?.img && (
                <Image
                  src={product?.img}
                  alt={product?.title || "Product image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-contain rounded-md"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-gray-700 group-hover:text-red-500">
                {product?.title}
              </span>
              <div className="flex flex-col items-end">
                <span className="font-bold text-red-500 group-hover:hidden">
                  ৳{product?.price}
                </span>
                <span className="bg-red-500 text-white py-1 px-3 rounded-sm hidden group-hover:block cursor-pointer">
                  Add to Cart
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Products;
