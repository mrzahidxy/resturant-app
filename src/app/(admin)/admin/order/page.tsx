import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import OrderStatusForm from "./order-status-form.component";

type Props = {};

const getData = async () => {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
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

const Orders = async (props: Props) => {
  const orders = await getData();

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((item: any) => (
            <tr
              className={`${item.status !== "delivered" && "bg-red-50"}`}
              key={item.id}
            >
              <td className="hidden md:block py-6 px-1">{item.id}</td>
              <td className="py-6 px-1">
                {item.createdAt.toString().slice(0, 10)}
              </td>
              <td className="py-6 px-1">{item.price}</td>
              <td className="hidden md:block py-6 px-1">
                {item.products[0].title}
              </td>
              <td>
                <OrderStatusForm item={item} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
