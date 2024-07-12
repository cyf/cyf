"use client";
import Script from "next/script";
import type { LngProps } from "@/types/i18next-lng";

const CookieBanner = (props: LngProps) => {
  const NEXT_PUBLIC_COOKIE_BANNER_ID = process.env.NEXT_PUBLIC_COOKIE_BANNER_ID;

  if (!NEXT_PUBLIC_COOKIE_BANNER_ID) return null;

  return (
    <>
      <Script
        id="cookieyes"
        src={`https://cdn-cookieyes.com/client_data/${NEXT_PUBLIC_COOKIE_BANNER_ID}/script.js`}
      />
    </>
  );
};

export default CookieBanner;
