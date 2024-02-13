import { User } from "@/payload-types";
import { Access, CollectionConfig, PayloadRequest } from "payload/types";

const isAdminOrHasAccessToImages = (): Access => {
  return async ({ req }) => {
    const user = req.user as User | undefined;

    if (!user) {
      return false;
    }

    if (user.role === "admin") {
      return true;
    }

    return {
      user: {
        equals: user.id,
      },
    };
  };
};

//const filePath = 'C:\\Users\\EVGENIY-PC\\Desktop\\Repository\\nodejs-homework-rest-api\\temp\\e-wallet-1280.png'

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
    read: async ({ req }) => {
      const user = req.user as User | undefined;
      const referer = req.headers.referer;

      const isClientSide = !referer?.includes("sell");

      if (!user || isClientSide) {
        return true;
      }

      return await isAdminOrHasAccessToImages()({ req });
    },

    update: isAdminOrHasAccessToImages(),
    delete: isAdminOrHasAccessToImages(),
  },
  upload: {
    // staticURL: "/media",
    // staticDir: "media",

    disableLocalStorage: true,
    // adminThumbnail: ({ doc }) => {
    //   console.log("doc:", doc);
    //   return 'http://res.cloudinary.com/dlc78cjak/image/upload/v1707841480/avatars/e-wallet-1280_krj3sx.png'
    // },
    
    // adminThumbnail: '/public/thumbnail.jpg', 

    // imageSizes: [
    //   {
    //     name: "thumbnail",
    //     width: 400,
    //     height: 300,
    //     position: "centre",
    //   },
    //   {
    //     name: "card",
    //     width: 768,
    //     height: 1024,
    //     position: "centre",
    //   },
    //   {
    //     name: "tablet",
    //     width: 1024,
    //     height: undefined,
    //     position: "centre",
    //   },
    // ],
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
