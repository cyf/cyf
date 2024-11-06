import React from "react";
import UserProvider from "./user-provider";
import { languages } from "@/i18n/settings";
import { useTranslation } from "@/i18n";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, "admin");
  return {
    title: t("title"),
    description: t("login"),
  };
}

export default async function AdminLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return <UserProvider lng={lng}>{children}</UserProvider>;
}
