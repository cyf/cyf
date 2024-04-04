import React from "react";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/types/i18next-lng";

export default function Or({ lng }: LngProps) {
  const { t } = useTranslation(lng, "login");

  return (
    <div className="flex items-center text-[14px] text-gray-500 before:mr-[10px] before:h-[1px] before:flex-1 before:bg-gray-300 before:content-[''] after:ml-[10px] after:h-[1px] after:flex-1 after:bg-gray-300 after:content-[''] dark:text-gray-100 before:dark:bg-gray-600 after:dark:bg-gray-600">
      {t("or")}
    </div>
  );
}
