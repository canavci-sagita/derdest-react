import Image from "next/image";
import "@/assets/css/app.css";
import "@/assets/css/auth.css";

import TranslationProvider from "@/stores/TranslationContext";
import { fetchTranslations } from "@/services/localization.service";
import { getCurrentLanguage } from "@/lib/utils/cookie.utils";

import imgLogo from "@/assets/images/logo.png";
import imgIllustration from "@/assets/images/auth/illustration.svg";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { App, ConfigProvider } from "antd";
import AntdRegistry from "@/components/providers/AntdRegistry";

const RootLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const lang = await getCurrentLanguage();
  let translations: Record<string, string>;

  try {
    translations = await fetchTranslations(lang);
  } catch (error) {
    console.error("Failed to load initial translations:", error);
    translations = {};
  }

  return (
    <QueryProvider>
      <TranslationProvider initialTranslations={translations} lang={lang}>
        <html className="derdest-main" lang={lang}>
          <head>
            <meta charSet="utf-8" />
            <title>Derdest AI</title>
            <base href="/" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </head>
          <body>
            <div className="relative h-screen lg:overflow-hidden bg-noise xl:bg-background xl:bg-none before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[6deg] before:bg-primary/[.95] before:bg-noise before:rounded-[35%] after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[28%] after:-mb-[16%] after:-ml-[12%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[6deg] after:border after:bg-accent after:bg-cover after:blur-xl after:rounded-[35%] after:border-[20px] after:border-primary">
              <div className="p-3 sm:px-8 relative h-full before:hidden before:xl:block before:w-[57%] before:-mt-[20%] before:-mb-[13%] before:-ml-[12%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-6deg] before:bg-primary/40 before:bg-noise before:border before:border-primary/50 before:opacity-60 before:rounded-[20%]">
                <div className="container relative z-10 mx-auto px-4 sm:px-12">
                  <div className="block grid-cols-2 gap-4 xl:grid">
                    <div className="hidden min-h-screen flex-col xl:flex">
                      <a className="flex items-center pt-10" href="">
                        <Image
                          className="w-6"
                          src={imgLogo}
                          alt="Derdest AI - Logo"
                        />
                        <span className="ml-3 text-xl font-medium text-white">
                          Derdest
                          <span className="font-light opacity-70">AI</span>
                        </span>
                      </a>
                      <div className="my-auto">
                        <Image
                          className="-mt-16 w-1/2"
                          src={imgIllustration}
                          alt="Derdest AI - Welcome Image"
                        />
                        <div className="mt-10 text-4xl font-medium leading-tight text-white">
                          A few more clicks to <br />
                          sign in to your account.
                        </div>
                        <div className="mt-5 text-lg text-white opacity-60">
                          Manage all your e-commerce accounts in one place
                        </div>
                      </div>
                    </div>
                    <AntdRegistry>
                      <App>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "rgb(var(--color-theme-1))",
                              colorPrimaryBorder: "rgb(var(--color-theme-1))",
                              colorLink: "rgb(var(--color-theme-1))",
                            },
                            components: {
                              Select: {
                                optionSelectedColor: "#ffffff",
                                activeOutlineColor: "0 0 0 0 transparent",
                                fontSize: 12,
                              },
                            },
                          }}
                        >
                          {children}
                        </ConfigProvider>
                      </App>
                    </AntdRegistry>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      </TranslationProvider>
    </QueryProvider>
  );
};

export default RootLayout;
