import InnerTest1 from "@/components/InnerTest1";
import { SyncedWithArticles } from "@/components/SyncedWithArticles";
import { getPayloadClient } from "@/get-payload";
import getQueryClient from "@/lib/helpers/getQueryClient";
import { Hydrate, dehydrate } from "@tanstack/react-query";

const getProducts = async () => {
  const payload = await getPayloadClient();

  const { docs: items } = await payload.find({
    collection: "products",
    depth: 0,
  });

  return items;
};

const Test1 = async  () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery([["getProducts"], { type: "query" }], getProducts);

  const dehydratedState = dehydrate(queryClient);
  console.log("Server");
  

  return (
    <>
      <Hydrate state={dehydratedState}>
        <InnerTest1 />
      </Hydrate>

      <SyncedWithArticles state={{count: 3}} />
      <h1 className="my-4 p-3 text-3xl font-bold underline bg-green-100">
        Articles server synced with client
      </h1>
      <InnerTest1 />
    </>
  );
};

export default Test1;
