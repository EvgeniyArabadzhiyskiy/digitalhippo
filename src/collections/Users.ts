import { User } from "@/payload-types";
import { CollectionConfig, FieldAccess, Access } from "payload/types";

export const adminsAndUser: Access<any, User> = ({ req: { user } }) => {
  if (user) {
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
      return true;
    }

    return {
      id: {
        equals: user.id,
      },
    };
  }

  return false;
};

export const isAdmin: Access<any, User> = ({ req: { user } }) => {
  const isAdmin = user?.role === "admin";
  return isAdmin;
};

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  const isAdmin = user?.role === "admin";
  return isAdmin;
};

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "role",
    // hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
  },

  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}&email=${user.email}'>Verify account</a>`;
      },
    },
    // depth: 0,
  },
  access: {
    read: adminsAndUser,
    // create: isAdmin,
    create: () => true,

    update: adminsAndUser, // isAdmin
    delete: isAdmin,
  },
  fields: [
    {
      name: "products",
      label: "Products",
      type: "relationship",
      relationTo: "products",
      admin: {
        condition: () => false,
      },
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product files",
      type: "relationship",
      relationTo: "product_files",
      admin: {
        condition: () => false,
      },
      hasMany: true,
    },

    {
      name: "role",
      defaultValue: "user",
      required: true,
      access: {
        read: () => true,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        // { label: "Guest", value: "guest" },
      ],
    },

    // {
    //   name: "sites",
    //   type: "relationship",
    //   relationTo: "sites",
    //   hasMany: true,
    //   access: {
    //     create: isAdminFieldLevel,
    //     update: isAdminFieldLevel,
    //   },
    // },
  ],
};
