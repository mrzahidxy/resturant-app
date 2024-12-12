import { TMenuItem } from "@/types/category";
import Link from "next/link";
import clsx from "clsx";

type Props = {};

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data: TMenuItem[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    return [];
  }
};

const MenuPage = async (props: Props) => {
  const menu = await getData();

  return (
    <div className="py-12">
      <div className="h-96 md:px-40 grid md:grid-cols-3">
        {menu.map((item) => (
          <Link
            href={`/menu/${item.slug}`}
            key={item.slug}
            className="p-4 shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.img})`,
            }}
          >
            <div className={clsx("w-1/2 space-y-2", `text-${item.color}`)}>
              <h1 className="text-3xl font-medium">{item.title}</h1>
              <p className="text-sm">{item.desc}</p>
              <div
                className={clsx(
                  "hidden 2xl:block w-24 text-center py-2 px-4 rounded-sm shadow-md",
                  item.color === "black"
                    ? "bg-black text-white"
                    : "bg-slate-50 text-red-500"
                )}
              >
                Explore
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
