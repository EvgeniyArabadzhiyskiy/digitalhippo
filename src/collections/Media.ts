import { User } from "@/payload-types";
import { Access, CollectionConfig, PayloadRequest } from "payload/types";

const isAdminOrHasAccessToImages = (): Access => {
  return  ({ req }) => {
    console.log("222222222222222222222222");
    
    const user = req.user as User | undefined;

    if (!user) {
      return false;
    }

    // if (user.role === "admin") {
    //   return true;
    // }

    return {
      user: {
        equals: user.id,
      },
    };
  };
};



export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return {
          ...data,
          user: req.user.id,
        };
      },
    ],
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read:  ({ req }) => {
      const user = req.user as User | undefined;;
      const referer = req.headers.referer;

      const isClientSide = !referer?.includes("sell");

      if (!user || isClientSide) {
        console.log("ClientSide==============", isClientSide);
        return true;
      }

      if (!user) {
        return false;
      }
  
      // if (user.role === "admin") {
      //   return true;
      // }
  
      return {
        user: {
          equals: user.id,
        },
      };

      // return  isAdminOrHasAccessToImages()({ req });
    },
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
