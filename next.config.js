const withImages = require("next-images");
const nextTranslate = require("next-translate");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❗ ELIMINA esta línea - NO uses 'output: standalone' a menos que sepas lo que haces
  // output: 'standalone', // ⬅️ QUITA ESTO
  
  // ✅ Esta SÍ es necesaria:
  distDir: '.next',
  
  images: {
    domains: ["storage.googleapis.com", "cdn.ndrz.io"],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  
  // 🔽 OPCIONAL: Si no usas topLevelAwait, puedes quitarlo
  webpack: (config) => {
    config.experiments = { topLevelAwait: true };
    return config;
  },
};

module.exports = nextTranslate(withImages(nextConfig));