import "./globals.css";
import cx from "classnames";
import { sfPro, inter } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";

export const metadata = {
  title: "ChenYifaer",
  description: "陈一发儿 - 童话镇里一枝花, 人美歌甜陈一发.",
  metadataBase: new URL("https://chenyifaer.com"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(sfPro.variable, inter.variable)}>
        <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
        <Suspense fallback="...">
          {/* @ts-ignore */}
          <Nav />
        </Suspense>
        <main
          id="main"
          className="flex min-h-screen w-full flex-col items-center justify-center py-32"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
