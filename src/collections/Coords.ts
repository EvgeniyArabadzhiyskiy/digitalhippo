import { Access, CollectionConfig, PayloadRequest } from "payload/types";
import { isAdminOrHasSiteAccess } from "./Sites";
import { isAdmin } from "./Users";
import { Site, User } from "@/payload-types";

export const isLoggedIn: Access<any, User> = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user);
};

const isAdminOrHasSiteAccessOrPublished: Access = ({ req }) => {
  const user = req.user as User | undefined;

  if (user) {
    const sites = req.user.sites as Site[];
    const sitesID = sites?.map(({ id }) => id);

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "user" && sites?.length > 0) {
      // Ограничение доступа должно быть выполненно единообразно
      // т.е если использовать or:[] то его нужно использовать во всех return
      return {
        or: [
          {
            site: {
              in: sitesID,
            },
          },
        ],
      };

      // Ограничение доступа должно быть выполненно единообразно
      // Если использовать доступ по отдельным свойствам то тогда
      // все свойства должны быть одинаковыми во всех return

      // return {
      //   site: {
      //     in: sitesID,
      //   },

      //   _status: {
      //     in: ["draft", "published"],
      //   },
      // };
    }
  }

  return {
    or: [
      {
        _status: {
          equals: "published",
        },
      },
    ],
  };

  // return {
  //   site: {
  //     not_equals: "",
  //   },

  //   _status: {
  //     equals: "published",
  //   },
  // };
};

export const Coords: CollectionConfig = {
  slug: "coords",
 
  
  access: {
    create: () => true,
    // create: isLoggedIn,
    update: isAdminOrHasSiteAccess(),
    read: isAdminOrHasSiteAccessOrPublished,
    // read: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: "user",
      relationTo: "users",
      type: "relationship",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "latitude",
      type: "number",
      required: true,
    },
    {
      name: "longitude",
      type: "number",
      required: true,
    },
    {
      name: "timestamp",
      type: "text",
      required: true,
    },
  ],
};
