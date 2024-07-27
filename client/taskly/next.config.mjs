/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/auth",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
