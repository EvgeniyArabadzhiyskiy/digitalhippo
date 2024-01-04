import { Product } from "@/payload-types";
// import { create } from "zustand";
import { persist, createJSONStorage, combine } from "zustand/middleware";
import { useMemo, useRef } from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";



const isClient = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return true;
};
// console.log( isClient());

export const useStoreSync = <T>(
  useStore: UseBoundStore<StoreApi<T>>,
  state: T
): UseBoundStore<StoreApi<T>> => {
  // Ref to store flag and avoid rerender.
  const unsynced = useRef(true);
  // Creating store hook with initial state from the server.
  const useServerStore = useMemo(() => create<T>(() => state), []);

  if (unsynced.current) {
    // Setting state and changing flag.
    useStore.setState(state);
    unsynced.current = false;
  }
  // For "client" we'll return the original store.
  // For "server" we'll return the newly created one.
  return isClient() ? useStore : useServerStore;
};

export type CountState = {
  count: number;
  increment: () => void;
};

export const useCountStore = create<CountState>()((set) => ({
  count: 0,
  increment: () => set((prev) => ({count: prev.count + 1})),
}));



export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

// export const useCart = create<CartState>();

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




