"use client";

import Image from "next/image";
import React, { useState } from "react";
import Cart from "./Cart.component";

type Props = {};

const Menu = (props: Props) => {
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
            <li>HomePage</li>
            <li>Menu</li>
            <li>Working Hours</li>
            <li>Contact</li>
            <li>Login</li>
            <Cart />
            <li className="flex gap-3 bg-orange-300 p-2 rounded-md">
              <Image src="/phone.png" width={20} height={20} alt="" /> 09258632
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Menu;
