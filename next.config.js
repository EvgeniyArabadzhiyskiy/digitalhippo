/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        // port: "3000",
        // pathname: "/media/**",
      },

      {
        protocol: "https",
        hostname: "digitalhippo-zck5.onrender.com",
      },
    ],
  },
};

module.exports = nextConfig;
