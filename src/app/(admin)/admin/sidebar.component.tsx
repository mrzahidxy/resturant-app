"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";


type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 p-2 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li
              className={`${
                pathname === "/admin/product" ? "bg-red-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <Link href="/admin/product">Products</Link>
            </li>
            <li
              className={`${
                pathname === "/admin/order" ? "bg-red-500 text-white" : ""
              } p-2 rounded-md`}
            >
              <Link href="/admin/order">Orders</Link>
            </li>
          </ul>
        </nav>
      </div>

      <ul>
        <div className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer">
          <button
            style={{
              all: "unset",
            }}
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </ul>
    </aside>
  );
};

export default Sidebar;
