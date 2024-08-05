// next.config.mjs
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"], // Ajoutez ici les domaines pour vos images
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
};

const pwaConfig = withPWA({
  dest: "public",
  disable: true,
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
