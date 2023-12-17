import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}&email=${user.email}'>Verify account</a>`;
      },
    },
  },
  access: {
    // read: () => true,
    // create: () => true,
    create: ({ req }) => req.user.role === "admin",
    update: ({ req }) => req.user.role === "admin",
    // delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "role",
      defaultValue: "user",
      required: true,
        // admin: {
        //   condition: (data, sec, {user}: {user: Partial<User>}) => {
        //     const isAdmin = user.role === "admin";
        //     return false
        //   },
        // },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
    },
  ],
};
