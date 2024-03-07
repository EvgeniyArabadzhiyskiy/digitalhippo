"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductListing from "./ProductListing";
import LocationTracker from "./LocationTracker";

interface PropsProductReel {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: PropsProductReel) => {
  const { title, subtitle, href, query } = props;

  const {
    data: queryResults,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = trpc.getInfinityProducts.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage;
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );

  const products = queryResults?.pages.flatMap((page) => page.items);

  let map: (Product | null)[] = [];
  // let count = 0;
  // const count = useRef(0);
  // console.log("ProductReel  count:", count.current);

  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      
      <div className="md:flex md:item-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {/* <Link href={"/test-1"}>Go Test</Link> */}

          {title ? (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          ) : null}

          {/* <button onClick={() => hasNextPage && fetchNextPage()}>
            Next Page
          </button> */}
          {/* <button onClick={() => (count.current += 1)}>Count + 1</button> */}

          {subtitle ? (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="hidden md:block text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Shop the colletion <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 flex items-center w-full">
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {map.map((product, i) => {
              return <ProductListing key={i} product={product} index={i} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
