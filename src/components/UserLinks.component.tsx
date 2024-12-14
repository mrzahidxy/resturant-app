"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Cart from "./Cart.component";

type Props = {};

const UserLinks = (props: Props) => {
  const { status, data } = useSession();

  if (status !== "authenticated") {
    return (
      <div className="flex items-center gap-4">
        <Link href="/auth/login">Login</Link>
        <Cart />
      </div>
    );
  }

  const isAdmin = data?.user?.isAdmin;

  return (
    <div className="flex items-center gap-4">
      {isAdmin ? (
        <Link href="/admin" className="cursor-pointer">
          Admin
        </Link>
      ) : (
        <>
          <Cart />
          <Link href="/orders" className="cursor-pointer">
            Orders
          </Link>
          <button
            className="cursor-pointer uppercase"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default UserLinks;
