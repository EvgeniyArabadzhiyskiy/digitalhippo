"use client";

import { useCountStore } from "@/hooks/use-cart";
import { trpc } from "@/trpc/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getProducts = async () => {
  const res = await fetch("http://localhost:3000/api/products", {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODFjMjVlNjNkODQ2MjhkMmM4NDA1MCIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImVtYWlsIjoiZXZnZW5peWFyYWJhZHppeXNraXlAZ21haWwuY29tIiwiaWF0IjoxNzA0MzkwNjQxLCJleHAiOjE3MDQzOTc4NDF9.VacQtIIJ82iszTThYB9bmi54BFfV7SarehQRzd7rwuQ",
    },
  });

  const items = await res.json();

  return items;
};

const InnerTest1 = () => {
  const queryClient = useQueryClient();

  const { count, increment } = useCountStore();
  console.log("InnerTest1  count:", count);

  // const sub = useFetchStore.subscribe(() => {
  //   console.log("Subscribe");
  // })

  const { data } = trpc.getProducts.useQuery(undefined, {
    staleTime: Infinity,
    // queryKey: ["getProducts", undefined]  // Можно без ключа
  });

  // const cacheKeys = queryClient.getQueryCache().queries;
  // console.log("InnerTest1  cacheKeys:", cacheKeys);

  return (
    <>
      <h1 className="text-5xl">
        {data && data[0].name}
        {count}
        Hello
      </h1>

      <button onClick={increment}>INCREMENT COUNT</button>
    </>
  );
};

export default InnerTest1;
