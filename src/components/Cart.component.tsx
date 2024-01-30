import Image from "next/image";
import React from "react";

type Props = {};

const Cart = (props: Props) => {
  return (
    <li className="flex gap-3 cursor-pointer">
      <Image src="/cart.png" alt="cart" width={20} height={20} />
      Cart(5)
    </li>
  );
};

export default Cart;
