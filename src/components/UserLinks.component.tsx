"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Cart from "./Cart.component";

type Props = {};

const Userlinks = (props: Props) => {
  const { status, data } = useSession();

  return status === "authenticated" ? (
    <div className="">
      {data?.user?.isAdmin ? (
        <Link href="/admin" className="cursor-pointer">
          Admin
        </Link>
      ) : (
        <div className="flex gap-4">
          <Cart />
          <Link href="/orders" className="cursor-pointer">
            Orders
          </Link>

          <button className="cursor-pointer uppercase" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link href="/auth/login">Login</Link>
  );
};

export default Userlinks;
