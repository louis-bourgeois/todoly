// next.config.mjs
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  experimental: {
    optimizeCss: true,
  },
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
  webpack: (config, { dev, isServer }) => {
    // Optimisations webpack personnalisées
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }
    return config;
  },
};

const pwaConfig = withPWA({
  dest: "public",
  disable: true,
  register: true,
  skipWaiting: true,
});

export default pwaConfig(nextConfig);
