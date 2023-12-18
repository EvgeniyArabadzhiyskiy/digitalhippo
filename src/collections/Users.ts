import { User } from "@/payload-types";
import { CollectionConfig, FieldAccess ,Access } from "payload/types";

export const adminsAndUser: Access<any, User> = ({ req: { user }}) => {
  // console.log("user:", user);
  if (user) {
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
      return true;
    }

    const resultObject = {
      id: {
        equals: user.id,
      },
    }
    // console.log("resultObject============", resultObject);

    return resultObject
  }

  return false;
};

export const isAdmin: Access<any, User> = ({ req: { user }}) => {
  const isAdmin = user?.role === "admin";
  return isAdmin;
};
 
export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user }}) => {
  const isAdmin = user?.role === 'admin';
  return isAdmin;
};

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
    read: adminsAndUser,
    create: isAdmin,  // create:() => true,

    update: adminsAndUser, // isAdmin
    delete: isAdmin,
    
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

      access: {
        // create: ({ req }: {req: PayloadRequest<User>}) => {
        //   const user = req.user?.role
        //   return true;
        // },
        // create: isAdminFieldLevel,
        update: isAdminFieldLevel,
        read: () => true,
      },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
    },

    {
      name: "sites",
      type: "relationship",
      relationTo: "sites",
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      // admin: {
      //   condition: (args) => {
      //       const ssr = args
      //       // console.log("ssr:", ssr);
      //     return true
      //   }
      // }
    }
  ],
};
