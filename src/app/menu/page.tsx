import { TMenuItem } from "@/types/category";
import Link from "next/link";

type Props = {};

const getData = async () => {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!res?.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = res.json() || [];
  return data;
};

const menuPage = async (props: Props) => {
  const menu = await getData();

  return (
    <div className="h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="lg:h-1/2 md:px-40 grid md:grid-cols-3">
        {menu?.map((item: TMenuItem) => (
          <Link
            href={`/menu/${item?.slug}`}
            key={item?.slug}
            className="p-4"
            style={{
              backgroundImage: `url(${item?.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`w-1/2 text-${item.color} space-y-2`}>
              <h1 className="text-3xl font-medium">{item?.title}</h1>
              <p className="text-sm">{item?.desc}</p>
              <Link
                href={`/menu/${item?.slug}`}
                className={`hidden w-24 text-center 2xl:block bg-${
                  item?.color === "black" ? "black" : "slate-50"
                } text-${
                  item?.color === "black" ? "white" : "red-500"
                } py-2 px-4 rounded-sm`}
              >
                Explore
              </Link>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default menuPage;
