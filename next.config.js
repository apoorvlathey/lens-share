/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/lens-share",
        destination: "/",
      },
      {
        source: "/lens-share/:path*",
        destination: "/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
