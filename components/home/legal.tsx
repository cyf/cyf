"use client";
import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Checkbox } from "muse-ui";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/types/i18next-lng";

export default function Legal({
  approved,
  setApproved,
  lng,
}: {
  approved: boolean;
  setApproved: Dispatch<SetStateAction<boolean>>;
} & LngProps) {
  const { t } = useTranslation(lng, "login");
  const { t: tf } = useTranslation(lng, "footer");

  return (
    <div className="flex flex-row items-center justify-center border-b border-gray-200 bg-white px-4 py-4 text-center dark:border-gray-700 dark:bg-gray-900 sm:px-16">
      <Checkbox
        checked={approved}
        onClick={() => setApproved(!approved)}
        id="terms"
        className="mr-1 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
      />
      <p className="text-left text-sm text-gray-500">
        {t("agree-content")}
        <Link className="text-blue-500" href={`/${lng}/legal/privacy`}>
          {tf("privacy")}
        </Link>
        {t("and")}
        <Link className="text-blue-500" href={`/${lng}/legal/terms-of-use`}>
          {tf("terms-of-use")}
        </Link>
      </p>
    </div>
  );
}
