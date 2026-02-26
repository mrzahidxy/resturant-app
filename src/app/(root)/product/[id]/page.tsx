import Price from "@/components/Price.component";
import { getProductById, getProducts } from "@/lib/api";
import { TProduct } from "@/types/product";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export async function generateStaticParams() {
  try {
    const payload = await getProducts({ limit: 1000 }, 86400);
    const products = Array.isArray(payload)
      ? payload
      : "data" in payload && Array.isArray(payload.data)
        ? payload.data
        : [];

    return (products || [])
      .map((product: TProduct) => ({ id: String(product.id) }))
      .filter((item) => item.id.length > 0);
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const SingleProductPage = async ({ params }: { params: { id: string } }) => {
  try {
    const singleProduct = await getProductById(params.id, 86400);

    return (
      <div className="bg-[#f6f6f6] pb-20 pt-10 text-slate-900">
        <section className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)]">
              <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                {singleProduct.img ? (
                  <Image
                    src={singleProduct.img}
                    alt={singleProduct.title || "Product Image"}
                    className="h-full w-full object-cover"
                    width={900}
                    height={900}
                    priority
                  />
                ) : (
                  <div className="h-[420px] bg-slate-100" />
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className={`${montserrat.className} text-2xl font-semibold sm:text-3xl`}>
                    {singleProduct.title || "Unnamed Product"}
                  </h1>
                  <p className="mt-3 text-sm text-slate-500 sm:text-base">
                    {singleProduct.desc || "No description available."}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Select size
                </p>
                <Price product={singleProduct} />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        <h1 className="text-2xl font-bold">Product not found!</h1>
      </div>
    );
  }
};

export default SingleProductPage;
