import { User } from "@/payload-types";
import { Access, CollectionConfig } from "payload/types";
import { isAdmin } from "./Users";

const isMySites: Access<any, User> = ({ req: { user } }) => {
  console.log("user:", user);
  if (user) {
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
      return true;
    }

    return {
      id: {
        equals: "65809a55626ddfc97d71c197",
      },
    };
  }

  return false;
};

const isAdminOrHasSiteAccess = (siteIDFieldName: string): Access => {
  return ({ req: { user } }) => {
    if (user) {
      if (user.role === "admin") return true;

      if (user.role === "user") {
        const result = {
          or: [
            // {
            //   [siteIDFieldName]: {
            //     in: user.sites.id,
            //   },
            // },
            //   {
            //     [siteIDFieldName]: {
            //       equals: user.sites,
            //     },
            //   },
            //   {
            //     id: {
            //       exists: false,
            //     }
            //   }
          ],
        };
        // console.log("return  result:", result.or[0].id);
        return {
          or: [
            {
              [siteIDFieldName]: {
                in: user.sites.id,
              },
            },
            {
              [siteIDFieldName]: {
                exists: false,
              },
            },

            // {
            //     [siteIDFieldName]: {
            //     equals: user.sites.id,
            //   },
            // },
          ],
        };

        return true;
      }
    }

    return false;
  };
};

export const Sites: CollectionConfig = {
  slug: "sites",
  admin: {
    useAsTitle: "title",
  },

  access: {
    read: isAdminOrHasSiteAccess("id"),
    // read: isMySites,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
  ],
};
