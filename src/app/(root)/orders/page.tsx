import Pagination from "@/components/Paginate.component";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { page?: string };
};

// Fetch orders data
const getData = async (page: number) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("auth/login");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        session: JSON.stringify(session),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};

// Orders Component
const Orders = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.page || "1", 10)

  const orders = await getData(page);


  if (!orders || orders.length === 0) {
    return (
      <div className="p-4 lg:px-20 xl:px-40">
        <h2 className="text-2xl font-bold text-center text-red-500">
          No orders found.
        </h2>
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-2 text-sm lg:text-base">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th className="hidden md:block py-2">Order ID</th>
            <th>Items</th>
            <th>Date</th>
            <th>Price</th>
            <th className="">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.data?.map((item: any) => (
            <tr
              className={`${
                item.status !== "delivered" ? "bg-red-50" : ""
              } border-b border-gray-200`}
              key={item.id}
            >
              <td className="hidden md:block py-4 px-2">{item.id}</td>
              <td className="py-4 px-2">
                {item.products.map((product: any) => product.title).join(", ")}
              </td>
              <td className="py-4 px-2">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }) +
                  " " +
                  new Date(item.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
              </td>
              <td className="py-4 px-2">${item.price}</td>
              <td className="hidden md:block py-4 px-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={orders.totalPages} initialPage={1}/>
    </div>
  );
};

export default Orders;
