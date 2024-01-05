"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Product } from "@/payload-types";
import { useCart } from "@/hooks/use-cart";

const AddToCartButton = ({ product }: { product: Product }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const {addItem} = useCart()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isSuccess]);

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => {
        addItem(product)
        setIsSuccess(true);
      }}
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
