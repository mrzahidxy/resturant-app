"use client";

import { createRequestId, logger, serializeError } from "@/utils/logger";
import { useCartStore } from "@/utils/store";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cartPageLogger = logger.child({ scope: "cart-page" });

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  const { data: session } = useSession();
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (body: any) => {
      const requestId = createRequestId();
      cartPageLogger.info("cart.checkout.order_create.request", {
        requestId,
        totalItems: body?.products?.length ?? 0,
        price: body?.price ?? null,
        userEmail: body?.userEmail ?? null,
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-request-id": requestId,
          },
          body: JSON.stringify(body),
        }
      );

      cartPageLogger.info("cart.checkout.order_create.response", {
        requestId,
        status: response.status,
      });

      return response.json();
    },

    onSuccess: (data) => {
      cartPageLogger.info("cart.checkout.order_create.success", {
        orderId: data?.id ?? null,
      });
      toast.success("Order is created successfully");
      push(`/pay/${data?.id}`);
    },
    onError: (error) => {
      cartPageLogger.error("cart.checkout.order_create.failed", {
        error: serializeError(error),
      });
      toast.error("Something went wrong");
    },
  });


  const handleCheckout = async () => {
    cartPageLogger.info("cart.checkout.started", {
      totalItems,
      totalPrice,
      cartProductsCount: products.length,
      userEmail: session?.user?.email ?? null,
    });

    if (!session) {
      cartPageLogger.warn("cart.checkout.unauthenticated_redirect", {
        totalItems,
        totalPrice,
      });
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
      cartPageLogger.info("cart.checkout.clear_cart.start", {
        itemsToRemove: products.length,
      });

      products.forEach((item) => removeFromCart(item));
      cartPageLogger.info("cart.checkout.clear_cart.done", {
        removedCount: products.length,
      });
    } catch (error) {
      cartPageLogger.error("cart.checkout.failed", {
        error: serializeError(error),
      });
      toast.error("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <section className="ui-shell py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="ui-muted text-xs font-semibold uppercase tracking-[0.24em]">
            Your order
          </p>
          <h1 className="ui-heading mt-2 text-2xl sm:text-3xl">Cart</h1>
          <p className="ui-muted mt-2 text-sm">
            {totalItems} item{totalItems === 1 ? "" : "s"} ready for checkout
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-start">
        <div className="ui-card rounded-3xl p-4 sm:p-6">
          {products.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--lb-border)] bg-white/70 px-6 text-center">
              <h2 className="ui-heading text-xl">Your cart is empty</h2>
              <p className="ui-muted mt-2 text-sm">
                Add items from the menu to continue to checkout.
              </p>
            </div>
          ) : (
            <div className="custom-scroll max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              {products.map((item) => (
                <div
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--lb-border)] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                  key={item?.id}
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[var(--lb-border)] bg-[#eef1f4] sm:h-24 sm:w-24">
                    {item?.img ? (
                      <Image
                        src={item?.img}
                        alt={item?.title || "Product Image"}
                        fill
                        loading="lazy"
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold uppercase text-[var(--lb-red)] sm:text-lg">
                          {item?.title}
                        </h2>
                        <p className="ui-muted mt-1 text-sm">
                          Qty {item?.quantity}
                          {item?.optionTitle ? ` • ${item.optionTitle}` : ""}
                        </p>
                      </div>
                      <p className="text-base font-bold text-[var(--lb-red)] sm:text-lg">
                        ${item?.price}
                      </p>
                    </div>
                  </div>

                  <button
                    className="ui-btn ui-btn-ghost ui-btn-sm self-start rounded-xl px-3 py-2 sm:self-center"
                    onClick={() => {
                      cartPageLogger.info("cart.item.remove_clicked", {
                        productId: item?.id,
                        title: item?.title,
                        quantity: item?.quantity,
                        price: item?.price,
                      });
                      removeFromCart(item);
                    }}
                    aria-label={`Remove ${item?.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="ui-card rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="ui-muted text-xs font-semibold uppercase tracking-[0.24em]">
            Summary
          </p>
          <div className="mt-4 space-y-4 text-[var(--lb-red)]">
            <div className="flex items-center justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span className="font-semibold">${totalPrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Service Cost</span>
              <span>$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery Cost</span>
              <span className="font-bold text-green-600">FREE!</span>
            </div>
          </div>

          <hr className="my-6 border-[var(--lb-border)]" />

          <div className="flex items-center justify-between text-lg font-bold text-[var(--lb-red)]">
            <span>TOTAL (INCL. VAT)</span>
            <span>${totalPrice}</span>
          </div>

          <button
            className="ui-btn ui-btn-primary mt-6 w-full rounded-xl py-3 disabled:translate-y-0"
            onClick={handleCheckout}
            disabled={products.length === 0}
          >
            Checkout
          </button>
        </aside>
      </div>
    </section>

  );
};

export default CartPage;
