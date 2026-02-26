"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Cart from "./Cart.component";

type Props = {};

const Userlinks = (props: Props) => {
  const { status, data } = useSession();

  return status === "authenticated" ? (
    <div>
      {data?.user?.isAdmin ? (
        <Link href="/admin" className="ui-nav-link">
          Admin
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Cart />
          <Link href="/orders" className="ui-nav-link">
            Orders
          </Link>

          <button className="ui-btn ui-btn-ghost" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link href="/auth/login" className="ui-btn ui-btn-secondary ui-btn-sm">
      Login
    </Link>
  );
};

export default Userlinks;
