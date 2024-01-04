"use client";

import { CountState, useCountStore, useStoreSync } from "@/hooks/use-cart";

export interface SyncedWithArticlesProps {
  state: CountState;
}

export const SyncedWithArticles = ({ state }: any) => {
  useStoreSync(useCountStore, state);
  return null;
};
