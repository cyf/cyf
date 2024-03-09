import React from "react";
import Link from "next/link";
import Image from "next/image";
import { basePath } from "@/constants";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/i18next-lng";

export default function PageHeader({ lng }: LngProps) {
  const { t } = useTranslation(lng, "login");

  return (
    <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-16">
      <Link href="/">
        <Image
          src={`${basePath}/logo.jpg`}
          alt="CYF logo"
          className="h-10 w-10 rounded-full"
          width={20}
          height={20}
        />
      </Link>
      <h3 className="text-xl font-semibold">{t("title")}</h3>
      <p className="text-sm text-gray-500">{t("tips")}</p>
    </div>
  );
}
