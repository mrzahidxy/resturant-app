'use client'

import { useCartStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type CartProps = {
  variant?: "default" | "light";
};

const Cart = ({ variant = "default" }: CartProps) => {
  const { totalItems } = useCartStore();
  const className =
    variant === "light"
      ? "ui-btn ui-btn-secondary ui-btn-lg min-w-52"
      : "ui-nav-link gap-2 px-3 py-2 normal-case tracking-normal";

  return (
    <Link href={"/cart"} className={className}>
      <Image src="/cart.png" alt="cart" width={20} height={20} loading="lazy" />
      <span className="font-semibold">Cart ({totalItems})</span>
    </Link>
  );
};

export default Cart;
