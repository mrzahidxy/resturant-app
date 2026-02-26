import { ActionTypes } from "./../types/cart";
import { CartType } from "@/types/cart";
import { logger, serializeError } from "@/utils/logger";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const cartLogger = logger.child({ scope: "store/cart" });

const INTIAL_STATE = {
  products: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create(
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

        cartLogger.info("cart.add.request", {
          productId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          existingItem: !!productInState,
          totalItemsBefore: get().totalItems,
          totalPriceBefore: get().totalPrice,
        });

        if (productInState) {
          const updatedProducts = products.map((product) =>
            product.id === productInState.id
              ? {
                  ...item,
                  quantity: item.quantity + product.quantity,
                  price: item.price + product.price,
                }
              : item
          );
          set((state) => ({
            products: updatedProducts,
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
          cartLogger.info("cart.add.updated_existing", {
            productId: item.id,
            totalItemsAfter: get().totalItems,
            totalPriceAfter: get().totalPrice,
          });
        } else {
          set((state) => ({
            products: [...state.products, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + item.price,
          }));
          cartLogger.info("cart.add.inserted_new", {
            productId: item.id,
            totalItemsAfter: get().totalItems,
            totalPriceAfter: get().totalPrice,
          });
        }
      },
      removeFromCart(item) {
        cartLogger.info("cart.remove.request", {
          productId: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          totalItemsBefore: get().totalItems,
          totalPriceBefore: get().totalPrice,
        });
        set((state) => ({
          products: state.products.filter((product) => product.id != item.id),
          totalItems: state.totalItems - item.quantity,
          totalPrice: state.totalPrice - item.price,
        }));
        cartLogger.info("cart.remove.success", {
          productId: item.id,
          totalItemsAfter: get().totalItems,
          totalPriceAfter: get().totalPrice,
        });
      },
    }),
    {
      name: "cart",
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          cartLogger.error("cart.persist.rehydrate_failed", {
            error: serializeError(error),
          });
          return;
        }

        cartLogger.info("cart.persist.rehydrated", {
          totalItems: state?.totalItems ?? 0,
          totalPrice: state?.totalPrice ?? 0,
          productsCount: state?.products?.length ?? 0,
        });
      },
    }
  )
);
