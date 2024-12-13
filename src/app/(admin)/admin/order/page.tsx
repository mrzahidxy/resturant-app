import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import OrderStatusForm from "./order-status-form.component";
import Pagination from "@/components/Paginate.component";

type Props = {
  searchParams?: {
    page?: string;
  };
};

const getData = async (page?: string) => {
  const session = await getServerSession(authOptions);

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/orders`);

  if (page) {
    url.searchParams.set("page", page);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      session: JSON.stringify(session),
    },
    cache: "no-store",
  });

  if (!res?.ok) {
    return null;
  }

  const data = (await res.json()) || [];
  return data;
};

const Orders = async ({ searchParams }: Props) => {
  const orders = await getData(searchParams?.page);

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Order Table</h1>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Products</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.data?.map((item: any) => (
              <tr className="border-b hover:bg-gray-50" key={item?.id}>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <p className="font-semibold">{item?.id}</p>
                  </div>
                </td>
                <td className="px-4 py-2 hidden md:table-cell">
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
                <td className="px-4 py-2">{item?.price}</td>
                <td className="px-4 py-2 hidden sm:table-cell">
                  {item.products
                    .map((product: any) => product.title)
                    .join(", ")}
                </td>

                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <OrderStatusForm item={item} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={orders?.totalPages}
        initialPage={orders?.currentPage}
      />
    </div>
  );
};

export default Orders;
