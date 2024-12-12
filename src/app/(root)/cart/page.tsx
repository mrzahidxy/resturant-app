"use client";

import { useCartStore } from "@/utils/store";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (body: any) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      return response.json();
    },

    onSuccess: (data) => {
      toast.success("Order is created successfully");
      push(`/pay/${data?.id}`);
    },
    onError: (error) => {
      toast.success("Something went wrong");
    },
  });


  const handleCheckout = async () => {
    if (!session) {
      push("auth/login");
      return;
    }

    try {
      const paylaod = {
        price: totalPrice,
        products: products,
        status: "not paid",
        userEmail: session?.user?.email,
      };

      await mutate(paylaod);

      products.forEach((item) => removeFromCart(item));
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div className="h-full flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-y-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLE ITEM */}
        {products.map((item) => (
          <div
            className="flex items-center justify-between mb-4"
            key={item?.id}
          >
            {item?.img && (
              <Image src={item?.img} alt="" width={100} height={100} />
            )}
            <div className="">
              <h1 className="uppercase text-xl font-bold">
                {item?.title} x{item?.quantity}
              </h1>
              <span>{item?.optionTitle}</span>
            </div>
            <h2 className="font-bold">${item?.price}</h2>
            <button
              className="font-bold cursor-pointer"
              onClick={() => removeFromCart(item)}
            >
              X
            </button>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal ({totalItems} items)</span>
          <span className="">${totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Service Cost</span>
          <span className="">$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="">Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">TOTAL(INCL. VAT)</span>
          <span className="font-bold">${totalPrice}</span>
        </div>
        <button
          className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
          onClick={handleCheckout}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;
