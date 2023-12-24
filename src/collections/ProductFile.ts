import { User } from "@/payload-types";
import payload from "payload";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  //   console.log("data==============", data);
  return {
    ...data,
    user: user?.id,
  };
};

const yourOwnOrPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user?.role === "admin") return true;
  if (!user) return false;

  const { docs: products } = await payload.find({
    collection: "products",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  // console.log("********* products:", products);

  const ownProductFileIds = products.map((prod) => prod.product_files);
  // console.log("ID=========:", ownProductFileIds);

  //  Будут выбраны все product_files которые есть у user 
  //  а не только которые есть в products данного user
  const { docs: product_files } = await payload.find({
    collection: "product_files",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  const ownProductFileIds1 = product_files.map((prod) => prod.id);  

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });
  // console.log("==============  orders:", orders);

  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string") {
          return req.payload.logger.error(
            "Search depth not sufficient to find purchased file IDs"
          );
        }

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
    })
    .filter(Boolean)
    .flat();

  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };

  // return true;
};

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeChange: [addUser],
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  access: {
    read: yourOwnOrPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    // {
    //   name: "name",
    //   type: "text",
    // },
  ],
};
