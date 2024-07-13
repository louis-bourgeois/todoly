/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/auth",
        destination: "/",
        permanent: true,
      },
      { source: "/app", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
