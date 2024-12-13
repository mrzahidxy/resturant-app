'use client'

import { useCartStore } from "@/utils/store";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Cart = (props: Props) => {
  const { totalItems } = useCartStore();
  return (
    <Link href={'/cart'} className="flex gap-1 cursor-pointer">
      <Image src="/cart.png" alt="cart" width={20} height={20} loading="lazy"/>
      Cart({totalItems})
    </Link>
  );
};

export default Cart;
