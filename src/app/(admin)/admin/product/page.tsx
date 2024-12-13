import { TProduct } from "@/types/product";
import Image from "next/image";
import ProductDelete from "./product-delete.component";
import Link from "next/link";
import Pagination from "@/components/Paginate.component";

type Props = {
  searchParams: { page?: string };
};

const getData = async (page?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (page) {
    url.searchParams.set("page", page);
  }

  console.log(url);
  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res?.ok) {
    return null;
  }

  const data = (await res.json()) || [];
  return data;
};

const Products = async ({ searchParams }: Props) => {
  const products = await getData(searchParams?.page);

  if (!products || products?.data?.length === 0) {
    return (
      <div className="w-full h-[60vh] flex justify-center items-center">
        <h1 className="text-2xl font-bold">No products found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Product Table</h1>
        <Link href="/admin/product/add">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Add Product
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr className="text-left">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left hidden sm:table-cell">
                Category
              </th>
              <th className="px-4 py-2 text-left hidden lg:table-cell">
                Created At
              </th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.data?.map((product: TProduct) => (
              <tr className="border-b hover:bg-gray-50" key={product?.id}>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <Image
                      src={product?.img!}
                      width={50}
                      height={50}
                      alt="Mediterranean Delight"
                      loading="lazy"
                      className="w-10 h-10 rounded-full mr-2 object-cover"
                    />
                    <Link
                      href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${product?.id}`}
                    >
                      {product?.title}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-2 hidden md:table-cell">
                  <p className="truncate max-w-xs">{product?.desc}</p>
                </td>
                <td className="px-4 py-2">{product?.price}</td>
                <td className="px-4 py-2 hidden sm:table-cell">
                  <Link
                    href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/menu/${product?.catSlug}`}
                  >
                    {product?.catSlug}
                  </Link>
                </td>
                <td className="px-4 py-2 hidden lg:table-cell">
                  {new Date(product?.createdAt).toLocaleString("en-US")}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    {/* TODO: add edit functionality */}
                    {/* <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-sm">
                      Edit
                    </button> */}

                    <ProductDelete id={product?.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={products?.totalPages} initialPage={1} />
    </div>
  );
};

export default Products;
