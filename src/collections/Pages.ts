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

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  versions: {
    drafts: true,
  },
  access: {
    // Anyone logged in can create
    create: isLoggedIn,
    // Only admins or editors with site access can update
    update: isAdminOrHasSiteAccess(),
    // Admins or editors with site access can read,
    // otherwise users not logged in can only read published
    read: isAdminOrHasSiteAccessOrPublished,
    // read: () => true,
    // Only admins can delete
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      required: true,
      defaultValue: ({ user }: { user: any }) => {
        console.log("user:", user.roles);

        if (user.role !== "admin" && user.sites?.[0]) {
          return user.sites[1];
        }
      },
    },
  ],
};
