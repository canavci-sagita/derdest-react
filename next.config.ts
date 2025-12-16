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
};

export default nextConfig;
