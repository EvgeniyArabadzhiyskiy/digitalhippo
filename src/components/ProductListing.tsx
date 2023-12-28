"use client";

import { Product } from "@/payload-types";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton />
      </div>
    </div>
  );
};

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  if (!product || !isVisible) return <ProductPlaceholder />;

  //   return <></>;
};

export default ProductListing;
