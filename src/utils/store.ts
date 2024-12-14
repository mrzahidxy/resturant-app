import { ActionTypes } from "./../types/cart";
import { CartType } from "@/types/cart";
import { create } from "zustand";
import { persist, devtools  } from "zustand/middleware";

const INTIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
  devtools(
    persist<CartType & ActionTypes>(
    (set, get) => ({
      products: INTIAL_STATE.products,
      totalItems: INTIAL_STATE.totalItems,
      totalPrice: INTIAL_STATE.totalPrice,

      addToCart(item) {
        const products = get().products;
        const productInState = products.find(
          (product) => product.id === item.id
        );

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...product,
                  quantity: product.quantity + item.quantity,
                  price: product.price + item.price,
                }
              : item
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
        }
      },
      removeFromCart(item) {
        set((state) => ({
          products: state.products.filter((product) => product.id != item.id),
          totalItems: state.totalItems - item.quantity,
          totalPrice: state.totalPrice - item.price,
        }));
      },
    }),
    { name: "cart" }
  ),
  { name: "CartStore" } // Name to display in Redux DevTools
)
);
