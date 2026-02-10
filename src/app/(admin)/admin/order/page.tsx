import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import OrderStatusForm from "./order-status-form.component";
import Pagination from "@/components/Paginate.component";
import { getAdminOrders } from "@/lib/api";

type Props = {
  searchParams?: {
    page?: string;
  };
};

const getData = async (page?: string) => {
  try {
    const session = await getServerSession(authOptions);
    return await getAdminOrders({ page, session }, 0);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return null;
  }
};

const Orders = async ({ searchParams }: Props) => {
  const orders = await getData(searchParams?.page);

  if (!orders || orders?.data?.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6f6f6] px-6 text-center text-slate-700">
        <div className="space-y-3 rounded-2xl bg-white p-8 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.35)]">
          <h1 className="text-2xl font-semibold text-[#C72C41]">
            No orders yet
          </h1>
          <p className="text-sm text-slate-500">
            New orders will appear here as soon as customers check out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] pb-20 pt-10 text-slate-900">
      <section className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Order Management
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              Track every order and keep the kitchen flow on schedule.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.35)]">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr className="text-left">
                <th className="px-5 py-4 text-left">Order ID</th>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Products</th>
                <th className="px-5 py-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders?.data?.map((item: any) => (
                <tr className="transition hover:bg-slate-50" key={item?.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{item?.id}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
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
                  <td className="px-5 py-4 font-semibold text-[#C72C41]">
                    {item?.price}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {item.products
                      .map((product: any) => product.title)
                      .join(", ")}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <OrderStatusForm item={item} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <Pagination
            totalPages={orders?.totalPages ?? 1}
            initialPage={orders?.currentPage ?? 1}
          />
        </div>
      </section>
    </div>
  );
};

export default Orders;
