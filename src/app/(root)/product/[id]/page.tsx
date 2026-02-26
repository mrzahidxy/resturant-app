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
      <div className="pb-16 pt-8 text-[var(--lb-ink)] md:pb-20 md:pt-10">
        <section className="ui-shell">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] md:mb-8">
            <span className="rounded-full bg-white px-3 py-1 text-[var(--lb-muted)] shadow-sm ring-1 ring-[var(--lb-border)]">
              Menu
            </span>
            <span className="text-[var(--lb-muted)]/70">/</span>
            <span className="rounded-full bg-[var(--lb-rose)] px-3 py-1 text-[var(--lb-red)] shadow-sm ring-1 ring-red-100">
              {singleProduct.catSlug || "Product"}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-8">
            <div className="ui-card overflow-hidden rounded-3xl p-4 sm:p-6">
              <div className="relative overflow-hidden rounded-2xl border border-[var(--lb-border)] bg-[#eef1f4] p-4 sm:p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/70 to-transparent" />
                {singleProduct.img ? (
                  <Image
                    src={singleProduct.img}
                    alt={singleProduct.title || "Product Image"}
                    className="h-full w-full object-contain"
                    width={900}
                    height={900}
                    priority
                  />
                ) : (
                  <div className="h-[320px] bg-[#eef1f4] sm:h-[420px]" />
                )}
              </div>
            </div>

            <div className="ui-card rounded-3xl p-6 sm:p-8">
              <div className="flex h-full flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  {singleProduct.isFeatured && (
                    <span className="rounded-full bg-[var(--lb-red)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lb-red)]">
                      Featured
                    </span>
                  )}
                  {singleProduct.catSlug && (
                    <span className="rounded-full bg-[var(--lb-rose)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lb-muted)]">
                      {singleProduct.catSlug}
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h1 className={`${montserrat.className} ui-heading text-2xl sm:text-3xl lg:text-4xl`}>
                    {singleProduct.title || "Unnamed Product"}
                  </h1>
                  <p className="ui-muted mt-3 max-w-prose text-sm leading-7 sm:text-base">
                    {singleProduct.desc || "No description available."}
                  </p>
                </div>

                {singleProduct.catSlug && (
                  <div className="mt-8 grid grid-cols-1 gap-3 sm:max-w-xs">
                    <div className="rounded-2xl border border-[var(--lb-border)] bg-white p-3">
                    <p className="ui-muted text-[11px] font-semibold uppercase tracking-[0.2em]">
                      Category
                    </p>
                    <p className="mt-2 truncate text-sm font-semibold uppercase text-[var(--lb-red)]">
                      {singleProduct.catSlug}
                    </p>
                  </div>
                  </div>
                )}

                <div className="mt-8 rounded-2xl border border-[var(--lb-border)] bg-[linear-gradient(to_bottom,#fff,#fdf9f6)] p-4 sm:p-5">
                  <p className="ui-muted text-xs font-semibold uppercase tracking-[0.28em]">
                  Select size
                  </p>
                  <div className="mt-4">
                    <Price product={singleProduct} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="ui-shell flex min-h-[40vh] items-center justify-center py-12">
        <div className="ui-card rounded-3xl px-8 py-10 text-center">
          <h1 className="text-2xl font-bold text-[var(--lb-red)]">Product not found!</h1>
          <p className="ui-muted mt-2 text-sm">Please try another item from the menu.</p>
        </div>
      </div>
    );
  }
};

export default SingleProductPage;
