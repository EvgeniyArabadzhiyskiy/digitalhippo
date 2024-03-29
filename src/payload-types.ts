/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    products: Product;
    sites: Site;
    media: Media;
    coords: Coord;
    product_files: ProductFile;
    orders: Order;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  products?: (string | Product)[] | null;
  product_files?: (string | ProductFile)[] | null;
  coords?: (string | Coord)[] | null;
  role: 'admin' | 'user';
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Product {
  id: string;
  user?: (string | null) | User;
  name: string;
  description?: string | null;
  price: number;
  category: 'ui_kits' | 'icons';
  product_files: string | ProductFile;
  approvedForSale?: ('pending' | 'approved' | 'denied') | null;
  priceId?: string | null;
  stripeId?: string | null;
  images: {
    image: string | Media;
    id?: string | null;
  }[];
  updatedAt: string;
  createdAt: string;
}
export interface ProductFile {
  id: string;
  user?: (string | null) | User;
  cloudinary?: {
    public_id?: string | null;
    original_filename?: string | null;
    format?: string | null;
    secure_url?: string | null;
    resource_type?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface Media {
  id: string;
  user?: (string | null) | User;
  cloudinary?: {
    public_id?: string | null;
    original_filename?: string | null;
    format?: string | null;
    secure_url?: string | null;
    resource_type?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface Coord {
  id: string;
  user?: (string | null) | User;
  latitude: number;
  longitude: number;
  timestamp: string;
  updatedAt: string;
  createdAt: string;
}
export interface Site {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}
export interface Order {
  id: string;
  _isPaid: boolean;
  user: string | User;
  products: (string | Product)[];
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}