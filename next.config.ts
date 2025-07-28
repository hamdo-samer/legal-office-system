import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  }
};

export default nextConfig;
