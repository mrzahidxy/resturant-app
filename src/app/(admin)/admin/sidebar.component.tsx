"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


type Props = {};

const Sidebar = (props: Props) => {
  const pathname = usePathname();
  const linkBase =
    "flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition";
  const linkActive = "bg-[#C72C41] text-white shadow-sm";
  const linkInactive =
    "text-slate-600 hover:bg-[#f6f6f6] hover:text-[#C72C41]";

  return (
    <aside className="flex min-h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white px-4 py-6 shadow-[0_20px_60px_-50px_rgba(15,23,42,0.35)]">
      <div className="space-y-8">
        <div className="space-y-1 px-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C72C41]">
            Admin
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Masimmo</h2>
          <p className="text-xs text-slate-500">Operations Console</p>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/product"
                className={`${linkBase} ${
                  pathname === "/admin/product" ? linkActive : linkInactive
                }`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/order"
                className={`${linkBase} ${
                  pathname === "/admin/order" ? linkActive : linkInactive
                }`}
              >
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
