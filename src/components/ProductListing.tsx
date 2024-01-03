"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";
import { getValidUrls } from "@/lib/helpers/getValidUrls";
import { trpc } from "@/trpc/client";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full bg-slate-500" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg bg-slate-500" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg bg-slate-500" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg bg-slate-500" />
    </div>
  );
};

const ProductListing = ({ product, index }: ProductListingProps) => {
  // console.log("ProductListing  index:", index);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // const {data} = trpc.anyApiRoutes.useQuery()
  // console.log("ProductListing  data:", data);

  // const {data: prods} = trpc.myNewRoute.useQuery('2')
  // console.log("ProductListing  prods:", prods);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    // (async () => {
    //   const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  
    //   const data = await res.json()
    //   console.log("data:", data[0]);
    //   return data;
    // })()

    return () => {
      // console.log("UNMOuNT");

      clearTimeout(timer);
    };
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  // const validUrls = product.images
  //   .map(({ image }) => {
  //     return typeof image === "string" ? image : image.url;
  //   })
  //   .filter(Boolean) as string[];

  const validUrls = getValidUrls(product);

  if (product && isVisible) {
    return (
      <Link
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
        href={`/product/${product.id}`}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={validUrls} />
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};

export default ProductListing;
