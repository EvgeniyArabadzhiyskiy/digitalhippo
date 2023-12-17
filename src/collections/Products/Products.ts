import { PRODUCT_CATEGORIES } from "../../config";
import { User } from "@/payload-types";
import { CollectionConfig } from "payload/types";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {},
  fields: [
    {
      name: "user",
      relationTo: "users",
      type: "relationship",
      required: true,
      defaultValue: ({ user }: { user: User }) => {
        return user.id;
      },
      hasMany: false, // один продукт не может быть создан несколькими людьми
      admin: {
        // condition: () => false, // скрыть это поле из панели администратора, и это буквально все, что оно делает

        condition: (data, siblingData, { user }: { user: Partial<User> }) => {
          const isAdmin = user.role === "admin";

          return isAdmin;
        },
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

    // {
    //   name: "product_files",
    //   label: "Product file(s)",
    //   type: "relationship",
    //   relationTo: "product_files",
    //   required: true,
    //   hasMany: true,
    // },

    {
      name: "approvedForSale",
      label: "Product Status",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
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
        // read: () => false,
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

    // {
    //   name: "images",
    //   label: "Product image",
    //   type: "array",
    //   minRows: 1,
    //   maxRows: 4,
    //   required: true,
    //   labels: {
    //     singular: "Image",
    //     plural: "Images",
    //   },
    //   fields: [
    //     {
    //       name: "image",
    //       type: "upload",
    //       relationTo: "media",
    //       required: true,
    //     },
    //   ],
    // },
  ],
};
