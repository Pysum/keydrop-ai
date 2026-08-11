/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Needed for pdfjs-dist to work on the client
      config.resolve.alias.canvas = false;
    }
    return config;
  },
  // Required for mammoth and pdfjs dynamic imports
  experimental: {
    serverComponentsExternalPackages: ["mammoth"],
  },
};

export default nextConfig;
