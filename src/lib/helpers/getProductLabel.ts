import { Product } from "@/payload-types";
import { PRODUCT_CATEGORIES } from "@/config";

export const getProductLabel = (product: Product) => {
  return PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;
};
