import { TProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type Props = {};

const getData = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?isFeatured=true`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return null;
    }

    return (await res.json()) || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return null;
  }
};

const Featured = async (props: Props) => {
  const featuredProducts = await getData();

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-600">
          No featured products found
        </h1>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scroll py-4">
      <div className="flex gap-6">
        {featuredProducts.map((product: TProduct) => (
          <Link
            href={`/product/${product?.id}`}
            key={product?.id}
            className="flex flex-col items-center w-[80vw] md:w-[45vw] lg:w-[30vw] h-[60vh] bg-white shadow-md rounded-lg overflow-hidden hover:bg-gray-50 transition duration-300"
          >
            {/* Product Image */}
            <div className="relative w-full h-[70%] bg-gray-100">
              <Image
                src={product?.img ?? "/no-image-found.jpg"}
                alt={product?.title ?? "Product Image"}
                fill
                loading="lazy"
                className="object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col items-center text-center gap-2">
              <h2 className="text-xl font-semibold text-gray-700">
                {product?.title ?? "Unnamed Product"}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product?.desc ?? "No description available."}
              </p>
              <span className="text-lg font-bold text-red-500">
                ৳{product?.price ?? "N/A"}
              </span>
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                Add to Cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Featured;
