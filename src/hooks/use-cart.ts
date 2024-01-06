import { Product } from "@/payload-types";
import { create } from "zustand";
import { persist, createJSONStorage, combine } from "zustand/middleware";

export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (newProduct: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newProduct) =>
        set((state) => {
          return {
            items: [...state.items, { product: newProduct }],
          };
        }),

      removeItem: (productId) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== productId),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type BearsAndTigersStore = {
  bears: number;
  tigers: number;
  increasePopulationBears: () => void;
  increasePopulationTigers: () => void;
  removeAllBears: () => void;
};

// export const useBearStore = create<BearsAndTigersStore>()((set) => ({
//   bears: 0,
//   tigers: 0,
//   increasePopulationBears: () => set((state) => ({ bears: state.bears + 1 })),
//   increasePopulationTigers: () =>
//     set((state) => ({ tigers: state.tigers + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
// }));

// type BearsStore = {
//   bears: number;
//   addABear: () => void;
// };

// export const useBearStor = create<BearsStore>()(
//     persist(
//       (set) => ({
//         bears: 0,
//         addABear: () => set({ bears: 0 }),
//       }),
//       {
//         name: 'food-storage',
//         storage: createJSONStorage(() => localStorage),
//       },
//     ),
//   )

export const useBearStore = create(
  persist(
    combine(
      {
        bears: 0,
        tigers: 0,
      },

      (set) => ({
        increasePopulationBears: () =>
          set((state) => ({ bears: state.bears + 1 })),
        increasePopulationTigers: () =>
          set((state) => ({ tigers: state.tigers + 1 })),
      })
    ),

    {
      name: "bearStore",
      storage: createJSONStorage(() => localStorage),
      //   partialize: (state) => ({ bears: state.bears }),
    }
  )
);
