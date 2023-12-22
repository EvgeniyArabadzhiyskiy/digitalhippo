import { Access, CollectionConfig } from "payload/types";
import { isAdmin } from "./Users";

export const isAdminOrHasSiteAccess = (
  siteIDFieldName: string = "site"
): Access => {
  return ({ req: { user } }) => {
    
    if (user) {
      const sitesID = user.sites.map(({ id }: { id: string }) => id);
      if (user.role === "admin") return true;

      if (user.role === "user" && user.sites?.length > 0) {
        return {
          or: [
            // {
            //   [siteIDFieldName]: {           // при depth в Users.auth.depth = 0
            //     in: user.sites,
            //   },
            // },

            {
              [siteIDFieldName]: {              // при depth в Users.auth.depth = 1
                in: sitesID,
              },
            },
            {
              [siteIDFieldName]: {
                exists: false,
              },
            },
          ],
        };
      }
    };

    return false;
  };
};

export const Sites: CollectionConfig = {
  slug: "sites",
  admin: {
    useAsTitle: "title",
  },
  // versions: {
  //   drafts: true
  // },

  access: {
    read: isAdminOrHasSiteAccess("id"),
    // read: () => true,
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
