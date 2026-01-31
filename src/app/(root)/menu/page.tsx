import { getMenuCategories } from "@/lib/api";
import { TMenuItem } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

type Props = {};

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const MenuPage = async (props: Props) => {
  let menu: TMenuItem[] = [];

  try {
    menu = await getMenuCategories();
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
  const topPicks = menu.slice(0, 3);
  const bannerPick = menu[3];

  return (
    <div className="bg-[#f6f6f6] pb-20 pt-10 text-slate-900">
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-500">
              Menu
            </p>
            <h1 className={`${montserrat.className} text-4xl font-semibold sm:text-5xl`}>
              Full Menu Explorer
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              A curated culinary journey featuring premium ingredients and seasonal inspiration.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topPicks.map((item) => (
            <Link
              href={`/menu/${item.slug}`}
              key={item.slug}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] transition hover:-translate-y-1"
            >
              <div className="relative h-64">
                {item.img ? (
                  <Image
                    src={item.img}
                    alt={item.title || "Menu category"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-slate-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
              </div>
              <div className="absolute inset-x-0 bottom-0 space-y-2 p-6 text-white">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">
                  {item.desc ?? "House-made classics with premium ingredients."}
                </p>
                <span className="inline-flex rounded-lg bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>

        {bannerPick && (
          <Link
            href={`/menu/${bannerPick.slug}`}
            className="mt-8 grid gap-8 overflow-hidden rounded-3xl bg-[#0d0f11] shadow-[0_30px_80px_-50px_rgba(15,23,42,0.6)] md:grid-cols-[1.1fr_1fr]"
          >
            <div className="space-y-4 p-8 text-white md:p-12">
              <h2 className={`${montserrat.className} text-3xl font-semibold md:text-4xl`}>
                {bannerPick.title ?? "Desserts"}
              </h2>
              <p className="text-sm text-white/80 md:text-base">
                {bannerPick.desc ??
                  "Sweet finishes baked fresh daily. From decadent chocolate lava cakes to light citrus tarts."}
              </p>
              <span className="inline-flex w-fit rounded-lg bg-white px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                Explore Our Sweets
              </span>
            </div>
            <div className="relative min-h-[220px] md:min-h-[320px]">
              {bannerPick.img ? (
                <Image
                  src={bannerPick.img}
                  alt={bannerPick.title || "Menu highlight"}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-slate-200" />
              )}
            </div>
          </Link>
        )}
      </section>
    </div>
  );
};

export default MenuPage;
