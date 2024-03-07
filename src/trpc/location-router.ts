import z from "zod";
import { publicProcedure, router } from "./trpc";
import { X } from "lucide-react";
import { getPayloadClient } from "../get-payload";

export const locationRouter = router({
  getCurrentLocation: publicProcedure.query(async () => {
    const payload = await getPayloadClient();

    const { docs: coords } = await payload.find({
      collection: "coords",
      where: {
        user: {
          equals: "65ca60558073c44dcd53c4dd",
        },
      },
    });

    return coords.slice(0, 10);
  }),

  setNewLocation: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        timestamp: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { latitude, longitude, timestamp } = input;

      const date = new Date(timestamp).toString().split("GMT")[0];

      const payload = await getPayloadClient();

      const coords = await payload.create({
        collection: "coords",
        data: {
          user: "65ca60558073c44dcd53c4dd",
          latitude,
          longitude,
          timestamp: date,
        },
      });

      return coords;
    }),
});
