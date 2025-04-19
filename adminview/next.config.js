/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable JSON parsing for data files to avoid issues
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
