import { TProduct } from "@/types/product";
import Image from "next/image";
import ProductDelete from "./product-delete.component";
import Link from "next/link";
import Pagination from "@/components/Paginate.component";
import { getAdminProducts } from "@/lib/api";
import { logger, serializeError } from "@/utils/logger";

type Props = {
  searchParams: { page?: string };
};

const getData = async (page?: string) => {
  const pageLogger = logger.child({ scope: "admin/product-page" });

  pageLogger.info("admin.products.fetch.start", { page: page ?? "1" });
  try {
    const data = await getAdminProducts({ page }, 0);
    pageLogger.info("admin.products.fetch.success", {
      page: page ?? "1",
      count: data?.data?.length ?? 0,
      totalPages: data?.totalPages ?? null,
    });
    return data;
  } catch (error) {
    pageLogger.error("admin.products.fetch.failed", {
      page: page ?? "1",
      error: serializeError(error),
    });
    return null;
  }
};

const Products = async ({ searchParams }: Props) => {
  const pageLogger = logger.child({ scope: "admin/product-page" });
  const products = await getData(searchParams?.page);
  pageLogger.debug("admin.products.render", {
    page: searchParams?.page ?? "1",
    hasProducts: !!products?.data?.length,
  });

  if (!products || products?.data?.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#f6f6f6] px-6 text-center text-slate-700">
        <div className="space-y-3 rounded-2xl bg-white p-8 shadow-[0_30px_80px_-55px_rgba(15,23,42,0.35)]">
          <h1 className="text-2xl font-semibold text-[#C72C41]">
            No products found
          </h1>
          <p className="text-sm text-slate-500">
            Add a new item to start building the menu lineup.
          </p>
          <Link
            href="/admin/product/add"
            className="inline-flex items-center justify-center rounded-full bg-[#C72C41] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#ad2436]"
          >
            Add Product
          </Link>
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
              Product Management
            </h1>
            <p className="text-sm text-slate-500 sm:text-base">
              Curate the menu catalogue and keep your offerings up to date.
            </p>
          </div>
          <Link
            href="/admin/product/add"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#C72C41] px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-900/20 transition hover:bg-[#ad2436]"
          >
            Add Product
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-55px_rgba(15,23,42,0.35)]">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr className="text-left">
                <th className="px-5 py-4 text-left">Title</th>
                <th className="hidden px-5 py-4 text-left md:table-cell">
                  Description
                </th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="hidden px-5 py-4 text-left sm:table-cell">
                  Category
                </th>
                <th className="hidden px-5 py-4 text-left lg:table-cell">
                  Created At
                </th>
                <th className="px-5 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products?.data?.map((product: TProduct) => (
                <tr className="transition hover:bg-slate-50" key={product?.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product?.img!}
                        width={50}
                        height={50}
                        alt="Mediterranean Delight"
                        loading="lazy"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <Link
                        href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${product?.id}`}
                        className="font-semibold text-slate-800 transition hover:text-[#C72C41]"
                      >
                        {product?.title}
                      </Link>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <p className="max-w-xs truncate text-slate-500">
                      {product?.desc}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-[#C72C41]">
                    {product?.price}
                  </td>
                  <td className="hidden px-5 py-4 sm:table-cell">
                    <Link
                      href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/menu/${product?.catSlug}`}
                      className="text-slate-600 transition hover:text-[#C72C41]"
                    >
                      {product?.catSlug}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-slate-500 lg:table-cell">
                    {new Date(product?.createdAt).toLocaleString("en-US")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/product/${product?.id}/edit`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-3 rounded text-sm"
                      >
                        Edit
                      </Link>
                      <ProductDelete id={product?.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <Pagination totalPages={products?.totalPages ?? 1} initialPage={1} />
        </div>
      </section>
    </div>
  );
};

export default Products;
