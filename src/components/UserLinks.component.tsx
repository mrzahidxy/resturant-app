"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

type Props = {};

const Userlinks = (props: Props) => {
  const { status, data } = useSession();

  return status === "authenticated" ? (
    <div className="space-x-4">
      <span className="cursor-pointer" onClick={() => signOut()}>
        Logout
      </span>
      {data?.user?.isAdmin && (
        <Link href="/add" className="cursor-pointer">
          Admin
        </Link>
      )}
      <Link href="/orders" className="cursor-pointer">
        Orders
      </Link>
    </div>
  ) : (
    <Link href="/auth/login">Login</Link>
  );
};

export default Userlinks;
