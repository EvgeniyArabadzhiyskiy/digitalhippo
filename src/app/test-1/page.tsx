import InnerTest1 from "@/components/InnerTest1";
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



const Test1 = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery([["getProducts"], { type: "query" }], getProducts);

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <Hydrate state={dehydratedState}>
        <InnerTest1 />
      </Hydrate>
    </>
  );
};

export default Test1;
