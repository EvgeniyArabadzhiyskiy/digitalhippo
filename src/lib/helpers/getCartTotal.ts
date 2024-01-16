import { CartItem } from "@/hooks/use-cart";

export const getCartTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => {
    return total + item.product.price;
  }, 0);
};
