import { Product } from "@/payload-types";

export const getValidUrls = (product: Product) => {
  const validUrls = product.images
    .map(({ image }) => {
      return typeof image === "string" ? image : image.url;
    })
    .filter(Boolean) as string[];
  return validUrls;
};
