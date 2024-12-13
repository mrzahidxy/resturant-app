import Price from "@/components/Price.component";
import { TProduct } from "@/types/product";
import Image from "next/image";

const fetchProduct = async (id: string): Promise<TProduct> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product data!");
  }

  return response.json();
};

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  try {
    const singleProduct = await fetchProduct(params.id);

    return (
      <div className="h-[calc(100vh-6rem)] lg:h-[calc(100vh-12rem)] px-4 md:px-12 lg:px-24 flex flex-col md:flex-row gap-10 justify-center items-center text-red-600">
        {/* IMAGE CONTAINER */}
        {singleProduct.img && (
          <div className="relative flex-1 w-80 h-80 md:w-96 md:h-96">
            <Image
              src={singleProduct.img}
              alt={singleProduct.title || "Product Image"}
              className="object-contain"
              fill
              loading="lazy"
            />
          </div>
        )}
        {/* TEXT CONTAINER */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold uppercase">{singleProduct.title || "Unnamed Product"}</h1>
          <p className="text-gray-600">{singleProduct.desc || "No description available."}</p>
          <Price product={singleProduct} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="h-full flex justify-center items-center text-red-500">
        <h1 className="text-2xl font-bold">Product not found!</h1>
      </div>
    );
  }
};

export default SingleProductPage;
