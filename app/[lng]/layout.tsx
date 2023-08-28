import "./globals.css";
import cx from "classnames";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import { dir } from "i18next";
import { languages } from "@/i18n/settings";
import { sfPro, inter } from "./fonts";
import { Providers } from "./providers";

export const metadata = {
  title: "ChenYifaer",
  description: "陈一发儿 - 童话镇里一枝花, 人美歌甜陈一发.",
  metadataBase: new URL("https://chenyifaer.com"),
  themeColor: "#FFF",
};

export async function generateStaticParams() {
  return languages.map((lng: string) => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html lang={params.lng} dir={dir(params.lng)} suppressHydrationWarning>
      <body className={cx(sfPro.variable, inter.variable)}>
        <Providers>
          <div className="fixed h-screen w-full bg-cyan-50 dark:bg-black" />
          <Suspense fallback="...">
            {/* @ts-ignore */}
            <Nav lng={params.lng} />
          </Suspense>
          <main
            id="main"
            className="flex min-h-screen w-full flex-col items-center justify-center py-32"
          >
            {children}
          </main>
          <Footer lng={params.lng} />
        </Providers>
      </body>
    </html>
  );
}
