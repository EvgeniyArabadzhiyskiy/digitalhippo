"use client";

import { trpc } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";

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
        Hello
      </h1>
    </>
  );
};

export default InnerTest1;
