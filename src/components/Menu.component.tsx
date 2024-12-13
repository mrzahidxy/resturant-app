"use client";

import Image from "next/image";
import React, { useState } from "react";
import Cart from "./Cart.component";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Props = {};

const Menu = (props: Props) => {
  const { status } = useSession();
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="cursor-pointer">
      <div onClick={() => setMenuOpen(!isMenuOpen)}>
        <Image
          src={`${isMenuOpen ? "/close.png" : "/open.png"}`}
          alt=""
          width={30}
          height={30}
          className="cursor-pointer"
        />
      </div>
      {isMenuOpen && (
        <nav className="absolute bg-red-500 w-full left-0 top-23 h-[calc(100vh-4rem)] z-50">
          <ul className="h-full flex flex-col gap-6 justify-center items-center text-lg font-semibold text-white">
            <Link href="/" onClick={() => setMenuOpen(!isMenuOpen)}>
              HomePage
            </Link>
            <Link href="/menu" onClick={() => setMenuOpen(!isMenuOpen)}>
              Menu
            </Link>
            <li>Contact</li>
            {status === "authenticated" ? (
              <div className="flex flex-col gap-4">
                <span className="cursor-pointer" onClick={() => signOut()}>
                  Logout
                </span>
                <Link
                  href="/orders"
                  className="cursor-pointer"
                  onClick={() => setMenuOpen(!isMenuOpen)}
                >
                  Orders
                </Link>
              </div>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(!isMenuOpen)}>
                Login
              </Link>
            )}
            <Cart />
            <li className="flex gap-3 bg-orange-300 p-2 rounded-md">
              <Image src="/phone.png" width={20} height={20} alt="" loading="lazy"/> 09258632
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Menu;
