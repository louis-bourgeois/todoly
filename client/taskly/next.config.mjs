import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "89.116.111.43"], // Ajouté l'IP de votre VPS
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://89.116.111.43:3001/api/:path*",
      },
      {
        source: "/socket.io/:path*",
        destination: "http://89.116.111.43:3001/socket.io/:path*",
      },
    ];
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
