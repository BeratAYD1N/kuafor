/** @type {import('next').NextConfig} */
const path = require("path")
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
      }
    }
    // Alias '@' --> './src' böylece import '@/dosya' çalışır
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src")
    }
    return config
  },
}

module.exports = nextConfig 