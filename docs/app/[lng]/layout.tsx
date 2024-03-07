import "./globals.css";
import React from "react";
import cx from "classnames";
import { dir } from "i18next";
import { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { BiArrowToTop } from "react-icons/bi";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/layout/footer";
import GoogleAnalytics from "@/components/shared/google-analytics";
import CookieBanner from "@/components/shared/cookie-banner";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { languages } from "@/i18n/settings";
import { basePath } from "@/constants";
import { sfPro, inter } from "./fonts";
import ReduxProvider from "./redux-provider";
import ThemeProvider from "./theme-provider";
import Particles from "./particles";

// 是否显示背景特效
const NEXT_PUBLIC_SHOW_PARTICLES = process.env.NEXT_PUBLIC_SHOW_PARTICLES;
// 是否全站置灰
const NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY =
  process.env.NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY;

const Header = dynamic(() => import("@/components/layout/header"), {
  ssr: false,
});

export function generateViewport(): Viewport {
  return {
    colorScheme: "dark",
    themeColor: "black",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata | undefined> {
  return {
    title: params.lng === "en" ? "ChenYifaer" : "陈一发儿",
    description: `${
      params.lng === "en" ? "ChenYifaer" : "陈一发儿"
    } - 童话镇里一枝花, 人美歌甜陈一发.`,
    metadataBase: new URL("https://chenyifaer.com"),
    icons: {
      icon: `${basePath}/logo.jpg`,
    },
  };
}

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
    <html
      lang={params.lng}
      dir={dir(params.lng)}
      className={NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY ? "grayscale" : ""}
      suppressHydrationWarning
    >
      <body className={cx(sfPro.variable, inter.variable)}>
        <NextTopLoader height={1} />
        <ReduxProvider>
          <ThemeProvider>
            {NEXT_PUBLIC_SHOW_PARTICLES && <Particles />}
            <Header lng={params.lng} />
            <main
              id="main"
              className="flex min-h-screen w-full flex-col items-center justify-center py-32"
            >
              {children}
              <GoogleAnalytics />
            </main>
            <Footer lng={params.lng} />
            <CookieBanner lng={params.lng} />
            <Toaster />
          </ThemeProvider>
        </ReduxProvider>
        <ScrollToTop
          smooth
          component={
            <BiArrowToTop className="mx-auto my-0 h-5 w-5 text-gray-700" />
          }
        />
      </body>
    </html>
  );
}
