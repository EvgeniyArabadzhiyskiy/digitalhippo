import { getPayloadClient } from "@/get-payload";

export const getProducts = async () => {
    const payload = await getPayloadClient();
  
    const { docs: items } = await payload.find({
      collection: "products",
      depth: 0,
    });
  
    return items;
  };