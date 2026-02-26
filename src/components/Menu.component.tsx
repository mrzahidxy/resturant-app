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
    <div>
      <button
        type="button"
        className="ui-btn ui-btn-ghost ui-btn-sm p-1"
        onClick={() => setMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <Image
          src={`${isMenuOpen ? "/close.png" : "/open.png"}`}
          alt=""
          width={30}
          height={30}
          className="cursor-pointer"
        />
      </button>
      {isMenuOpen && (
        <nav className="absolute left-0 top-20 z-50 h-[calc(100vh-5rem)] w-full bg-[var(--lb-red)] px-6 py-8 shadow-2xl">
          <ul className="flex h-full flex-col items-center justify-center gap-5 text-lg font-semibold text-white">
            <li>
              <Link
                href="/"
                className="ui-btn ui-btn-secondary ui-btn-lg min-w-52"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                Homepage
              </Link>
            </li>
            <li>
              <Link
                href="/menu"
                className="ui-btn ui-btn-secondary ui-btn-lg min-w-52"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="ui-btn ui-btn-secondary ui-btn-lg min-w-52"
                onClick={() => setMenuOpen(!isMenuOpen)}
              >
                Contact
              </Link>
            </li>
            {status === "authenticated" ? (
              <>
                <li>
                  <button className="ui-btn ui-btn-secondary ui-btn-lg min-w-52" onClick={() => signOut()}>
                    Logout
                  </button>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className="ui-btn ui-btn-secondary ui-btn-lg min-w-52"
                    onClick={() => setMenuOpen(!isMenuOpen)}
                  >
                    Orders
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/auth/login"
                  className="ui-btn ui-btn-secondary ui-btn-lg min-w-52"
                  onClick={() => setMenuOpen(!isMenuOpen)}
                >
                  Login
                </Link>
              </li>
            )}
            <li>
              <Cart variant="light" />
            </li>
            <li className="ui-phone-pill">
              <Image src="/phone.png" width={20} height={20} alt="" loading="lazy" />
              <span>09258632</span>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Menu;
