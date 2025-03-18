import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: [
      "myshop-2-production.up.railway.app",
      "res.cloudinary.com",
      "cdn.shopify.com",
      "images.unsplash.com",
      "random.imagecdn.app",
      "picsum.photos",
      "plus.unsplash.com",
    ],
  },
};

export default nextConfig;
