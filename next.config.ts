const nextConfig = {
  // i18n: {
  //   locales: ["en", "et", "tr"],
  //   defaultLocale: "en",
  // },
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  output: "standalone",
};

export default nextConfig;
