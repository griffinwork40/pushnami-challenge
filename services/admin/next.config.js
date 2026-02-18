/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@pushnami/shared'],
  serverExternalPackages: [],
};

module.exports = nextConfig;
