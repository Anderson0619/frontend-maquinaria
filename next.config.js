const withImages = require("next-images");
const withPlugins = require("next-compose-plugins");
const nextTranslate = require("next-translate");
const withPWA = require("next-pwa");

const { parsed: myEnv } = require("dotenv").config({
  path: ".env",
});

const config = {
  images: {
    domains: ["storage.googleapis.com", "cdn.ndrz.io"],
  },
  pwa: {
    dest: "public",
    maximumFileSizeToCacheInBytes: 5242880,
    disable: process.env.NODE_ENV === "development",
  },
  typeScript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    config.experiments = { topLevelAwait: true, layers: true };
    return config;
  },
};

module.exports = withPlugins([withImages, withPWA, nextTranslate], config);
