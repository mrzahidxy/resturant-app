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
      next: { revalidate: 0 },
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
      <section className="ui-shell py-6 md:py-10">
        <div className="ui-card flex min-h-[260px] flex-col items-center justify-center rounded-3xl px-6 text-center">
          <h2 className="ui-heading text-2xl text-[var(--lb-red)]">No orders found</h2>
          <p className="ui-muted mt-2 text-sm">Your recent orders will appear here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ui-shell py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ui-muted text-xs font-semibold uppercase tracking-[0.24em]">
            Account
          </p>
          <h1 className="ui-heading mt-2 text-2xl sm:text-3xl">Orders</h1>
          <p className="ui-muted mt-2 text-sm">
            Track your recent purchases and payment status.
          </p>
        </div>
      </div>

      <div className="ui-card overflow-hidden rounded-3xl p-3 sm:p-4">
        <div className="hidden rounded-2xl border border-[var(--lb-border)] bg-white lg:block">
          <table className="w-full text-left text-sm text-[var(--lb-ink)]">
            <thead>
              <tr className="border-b border-[var(--lb-border)] bg-[var(--lb-rose)]/45 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lb-muted)]">
                <th className="px-5 py-4">Order ID</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.data?.map((item: any) => {
                const createdAt = new Date(item.createdAt);
                const isPaid = String(item.status).toLowerCase().includes("paid");
                return (
                  <tr
                    className="border-b border-[var(--lb-border)] last:border-b-0 hover:bg-[var(--lb-rose)]/20"
                    key={item.id}
                  >
                    <td className="max-w-[260px] truncate px-5 py-4 font-medium text-[var(--lb-red)]">
                      {item.id}
                    </td>
                    <td className="px-5 py-4">
                      {item.products.map((product: any) => product.title).join(", ")}
                    </td>
                    <td className="px-5 py-4">
                      {createdAt.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      {createdAt.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[var(--lb-red)]">${item.price}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-[var(--lb-rose)] text-[var(--lb-red)]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 lg:hidden">
          {orders?.data?.map((item: any) => {
            const createdAt = new Date(item.createdAt);
            const isPaid = String(item.status).toLowerCase().includes("paid");
            return (
              <article
                key={item.id}
                className="rounded-2xl border border-[var(--lb-border)] bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="ui-muted text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Order ID
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--lb-red)]">
                      {item.id}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      isPaid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[var(--lb-rose)] text-[var(--lb-red)]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="ui-muted text-[11px] font-semibold uppercase tracking-[0.18em]">
                      Items
                    </p>
                    <p className="mt-1">
                      {item.products.map((product: any) => product.title).join(", ")}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="ui-muted text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Date
                      </p>
                      <p className="mt-1">
                        {createdAt.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="ui-muted text-[11px] font-semibold uppercase tracking-[0.18em]">
                        Price
                      </p>
                      <p className="mt-1 font-semibold text-[var(--lb-red)]">${item.price}</p>
                    </div>
                  </div>
                  <p className="ui-muted text-xs">
                    {createdAt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination totalPages={orders.totalPages} initialPage={page} />
      </div>
    </section>
  );
};

export default Orders;
