import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });

const specialties = [
  {
    title: "Hand-crafted Pasta",
    image: "/slide1.png",
  },
  {
    title: "Aged Ribeye",
    image: "/slide2.png",
  },
  {
    title: "Signature Desserts",
    image: "/offerProduct.png",
  },
];

const atmosphereHighlights = [
  "Private Dining Rooms Available",
  "Sommelier-curated Wine List",
  "Live Jazz Evenings (Fri–Sat)",
];

export default function Home() {
  return (
    <div className="bg-[var(--lb-cream)] text-[var(--lb-ink)]">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10 pb-16">
        <div className="rounded-[32px] border border-[var(--lb-border)] bg-[var(--lb-rose)]/40 p-4 shadow-[0_30px_80px_-40px_rgba(20,9,2,0.55)]">
          <div className="relative overflow-hidden rounded-[26px]">
            <div className="relative min-h-[420px] sm:min-h-[520px]">
              <Image
                src="/slide3.jpg"
                alt="Chef plated seasonal cuisine"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6 text-center text-white">
                <p className="rounded-full border border-white/30 bg-black/30 px-4 py-1 text-xs uppercase tracking-[0.3em]">
                  Luxe Bistro
                </p>
                <h1
                  className={`${playfair.className} text-4xl font-semibold leading-tight drop-shadow-sm sm:text-5xl lg:text-6xl`}
                >
                  Exquisite Flavors,
                  <br />
                  Unforgettable Moments
                </h1>
                <p className="max-w-2xl text-sm text-white/85 sm:text-base">
                  Experience the pinnacle of fine dining with our chef’s signature seasonal creations
                  and curated wine pairings.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="rounded-full bg-[var(--lb-red)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:translate-y-[-1px] hover:bg-[#c3212c]"
                  >
                    Book a Table
                  </Link>
                  <Link
                    href="/menu"
                    className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    View Menu
                  </Link>
                </div>
                <div className="mt-6 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/70">
                  Discover
                  <span className="text-lg">⌄</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--lb-red)]">
          Chef’s selection
        </p>
        <div className="mt-2 flex items-end justify-between gap-6">
          <h2 className={`${playfair.className} text-3xl font-semibold sm:text-4xl`}>
            Our Specialties
          </h2>
          <span className="hidden h-[2px] w-24 bg-[var(--lb-red)] sm:block" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {specialties.map((item, index) => (
            <div
              key={item.title}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--lb-border)] bg-white shadow-[0_25px_60px_-40px_rgba(0,0,0,0.7)] animate-fade-up animate-delay-${index + 1}`}
            >
              <div className="relative h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/70" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-lg font-semibold text-white drop-shadow">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Atmosphere */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative h-[320px] overflow-hidden rounded-3xl border border-[var(--lb-border)] shadow-[0_30px_70px_-45px_rgba(0,0,0,0.6)] sm:h-[380px] lg:h-[440px]">
            <Image
              src="/loginBg.png"
              alt="Warm dining room ambiance"
              width={900}
              height={700}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className={`${playfair.className} text-3xl font-semibold text-[var(--lb-ink)]`}>
              An Atmosphere as Refined as the Cuisine
            </h3>
            <p className="text-sm leading-relaxed text-[var(--lb-muted)] sm:text-base">
              Step into a world where modern architecture meets warm hospitality. Our dining room is
              designed to provide an intimate yet vibrant backdrop for your most cherished
              celebrations.
            </p>
            <ul className="space-y-3 text-sm text-[var(--lb-ink)]">
              {atmosphereHighlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lb-red)] text-xs font-bold text-white">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[var(--lb-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,238,232,0.92))] p-10 text-center shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)] sm:p-14">
          <h3 className={`${playfair.className} text-3xl font-semibold sm:text-4xl`}>
            Experience Culinary Excellence
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--lb-muted)] sm:text-base">
            Join us for an unforgettable evening of premium flavors and elegant atmosphere. Tables
            are limited, we recommend booking in advance.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--lb-red)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/25 transition hover:translate-y-[-1px] hover:bg-[#c3212c]"
          >
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
