"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
  "/admin/product": "Products",
  "/admin/order": "Orders",
};

const AdminNavbar = () => {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? "Dashboard";

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-[0_20px_60px_-60px_rgba(15,23,42,0.35)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C72C41]">
          Admin
        </p>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <button
        className="ui-btn ui-btn-secondary"
        onClick={() => signOut()}
      >
        Logout
      </button>
    </header>
  );
};

export default AdminNavbar;
