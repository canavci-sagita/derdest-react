import "@/assets/css/app.css";
import "@/assets/css/auth.css";

import TranslationProvider from "@/stores/TranslationContext";
import { fetchTranslations } from "@/services/localization.service";
import { getCurrentLanguage } from "@/lib/utils/cookie.utils";

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
    <html className="derdest-main" lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>Derdest AI</title>
        <base href="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="relative h-screen lg:overflow-hidden bg-noise xl:bg-background xl:bg-none">
          <div className="p-3 sm:px-8 relative h-full">
            <div className="container relative z-10 mx-auto px-4 sm:px-12">
              <TranslationProvider
                initialTranslations={translations}
                lang={lang}
              >
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
              </TranslationProvider>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
