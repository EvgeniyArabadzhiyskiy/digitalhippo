import { PRODUCT_CATEGORIES } from "../../config";
import { Product, User } from "@/payload-types";
import { Access, CollectionConfig, Condition } from "payload/types";
import { isAdmin, isAdminFieldLevel } from "../Users";
import payload from "payload";

const isAdminCondition: Condition<any, any> = (
  data,
  siblingData,
  { user }: { user: Partial<User> }
) => {
  const isAdmin = user.role === "admin";
  return isAdmin;
};

const isMyProducts: Access<any, User> = async ({ req: { user } }) => {
  if (user) {
    if (user?.role === "admin") {
      return true;
    }

    return {
      user: {
        equals: user.id,
      },
    };
  }

  return false;
};

export const Products: CollectionConfig = {
  slug: "products",
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        const user = req.user as User;

        return {
          ...data,
          user: user.id,
        };
      },
    ],
  },
  admin: {
    useAsTitle: "name",
  },

  access: {
    read: isMyProducts,
    create: () => true,
    update: isAdmin,
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
      name: "name",
      label: "Name of Product",
      type: "text",
      required: true,
    },

    {
      name: "description",
      label: "Product details",
      type: "textarea",
      defaultValue: () => "Djon create this product",

      access: {
        create: isAdminFieldLevel,
        update: () => true,
      },
    },

    {
      name: "price",
      label: "Price in USD",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
    },

    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => {
        return { label, value };
      }),
      required: true,
    },

    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      relationTo: "product_files",
      required: true,
      hasMany: false,
    },

    {
      name: "approvedForSale",
      label: "Product Status",
      access: {
        create: isAdminFieldLevel,
        read: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: "pending",
      type: "select",
      options: [
        {
          label: "Pending verefication",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },

    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },

    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },

    {
      name: "images",
      label: "Product image",
      type: "array",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
