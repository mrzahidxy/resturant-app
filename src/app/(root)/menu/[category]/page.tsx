import { getMenuCategories, getProductsByCategory } from "@/lib/api";
import { TProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

type Props = {
  params: { category: string };
};

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export async function generateStaticParams() {
  try {
    const categories = await getMenuCategories();
    return (categories || [])
      .map((category) => ({ category: String(category.slug) }))
      .filter((item) => item.category.length > 0);
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const Products = async ({ params }: Props) => {
  let products: TProduct[] | { data: TProduct[] } = [];

  try {
    products = await getProductsByCategory(params?.category);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  const productList = Array.isArray(products)
    ? products
    : "data" in products && Array.isArray(products.data)
      ? products.data
      : [];
  const categoryLabel = params?.category?.replace(/-/g, " ") ?? "Menu";
  const topPicks = productList.slice(0, 6);
  const fallbackImages = [
    "/slide1.png",
    "/slide2.png",
    "/slide3.jpg",
    "/offerProduct.png",
  ];

  if (productList.length === 0) {
    return (
      <div className="bg-[var(--lb-cream)] py-20 text-center text-[var(--lb-ink)]">
        <h1 className={`${playfair.className} text-3xl font-semibold`}>
          No products available in this category.
        </h1>
        <p className="mt-3 text-sm text-[var(--lb-muted)]">
          Please check back soon for seasonal additions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--lb-cream)] pb-20 pt-10 text-[var(--lb-ink)]">
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--lb-red)]">
              Menu
            </p>
            <h1
              className={`${playfair.className} text-4xl font-semibold sm:text-5xl`}
            >
              Full Menu Explorer
            </h1>
            <p className="text-sm text-[var(--lb-muted)] sm:text-base">
              A curated culinary journey featuring premium ingredients and
              seasonal inspiration. Handcrafted by Chef de Cuisine.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <h2 className={`${playfair.className} text-3xl font-semibold`}>
            {categoryLabel}
          </h2>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--lb-red)]">
            {topPicks.length} selection{topPicks.length === 1 ? "" : "s"}{" "}
            available
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((product: TProduct, index: number) => (
            <Link
              href={`/product/${product?.id}`}
              key={product?.id}
              className="group overflow-hidden rounded-3xl border border-[var(--lb-border)] bg-white shadow-[0_30px_70px_-50px_rgba(0,0,0,0.6)] transition hover:-translate-y-1"
            >
              <div className="relative h-56">
                <Image
                  src={
                    product?.img ||
                    fallbackImages[index % fallbackImages.length]
                  }
                  alt={product?.title || "Menu item"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />
                {index === 0 && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--lb-red)]">
                    Signature
                  </span>
                )}
              </div>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-[var(--lb-ink)]">
                      {product?.title}
                    </h3>
                    <span className="text-sm font-semibold text-[var(--lb-red)]">
                      ৳{product?.price}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--lb-muted)] line-clamp-2">
                    {product?.desc ??
                      "Seasonal chef selection with premium ingredients."}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-[var(--lb-muted)]">
                    Seasonal
                  </span>
                  <div className="rounded-full bg-[var(--lb-red)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition group-hover:bg-[#c3212c]">
                    + Add to Order
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-xs text-[var(--lb-muted)]">
            Prices and availability subject to seasonal change.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Products;
