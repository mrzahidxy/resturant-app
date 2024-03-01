import { menu } from "@/data";
import Link from "next/link";

type Props = {};

const menuPage = (props: Props) => {
  return (
    <div className="h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="lg:h-1/2 md:px-40 grid md:grid-cols-3">
        {menu?.map((item, index) => (
          <Link
            key={index}
            href={`/menu/${item?.title}`}
            className="p-4"
            style={{
              backgroundImage: `url(${item?.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`w-1/2 text-${item.color}`}>
              <h1 className="text-3xl">{item?.title}</h1>
              <p className="text-sm">{item?.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default menuPage;
