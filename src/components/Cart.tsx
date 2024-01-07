"use client";

import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";

const Cart = () => {
  const { items } = useCart();
  console.log("Cart  items:", items);
  const itemCount = items.length;
  const fee = 1;

  const cartTotal = items.reduce((total, item) => {
    return total + item.product.price;
  }, 0);

  return (
    <Sheet>
      <SheetTrigger
        className="group -m-6 flex items-center p-2"
        aria-hidden="true"
      >
        <ShoppingCart className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {itemCount}
        </span>
      </SheetTrigger>
      <SheetContent className="w-full flex flex-col pr-0 sm:max-w-lg ">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-green-900">Cart ({itemCount})</SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">
              <ScrollArea>
                {items.map(({ product }) => {
                  return <CartItem key={product.id} product={product} />;
                })}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>

                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                alt="empty shopping cart hippo"
                fill
              />
            </div>

            <div className="text-xl font-semibold">Your cart is empty</div>

            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add items to your to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
