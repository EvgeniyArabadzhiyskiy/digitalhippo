import { Access, CollectionConfig, PayloadRequest } from "payload/types";
import { isAdminOrHasSiteAccess } from "./Sites";
import { isAdmin } from "./Users";
import { Site, User } from "@/payload-types";
import { AccessResult } from "payload/dist/exports/config";

export const isLoggedIn: Access<any, User> = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user);
};

const isAdminOrHasSiteAccessOrPublished: Access = ({
  req,
}: {
  req: PayloadRequest;
}) => {
  const user = req.user as User | undefined;

  if (user) {
    const sites = req.user.sites as Site[];
    const sitesID = sites.map(({ id }) => id);

    if (user.role === "admin") {
      return true;
    }

    if (user.role === "user" && sites.length > 0) {
      return {
        or: [
          {
            site: {
              in: sitesID,
            },
          },
          {
            site: {
              exists: false,
            },
          },
        ],
      };
    }
  }

  return false;

  // return {
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
        if (user.roles !== "admin" && user.sites?.[0]) {
          return user.sites[0];
        }
      },
    },
  ],
};
