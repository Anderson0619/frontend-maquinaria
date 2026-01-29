const withImages = require("next-images");
const nextTranslate = require("next-translate");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔴 IMPRESCINDIBLE: Esto falta en tu archivo
  output: 'standalone',
  distDir: '.next',
  
  images: {
    domains: ["storage.googleapis.com", "cdn.ndrz.io"],
  },
  
  // 🔴 CORREGIR: "typeScript" debe ser "typescript" (minúscula)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};

// 🔴 ELIMINAR: withPlugins, withPWA, dotenv
module.exports = withImages(nextTranslate(nextConfig));