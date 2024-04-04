import React, { Dispatch, SetStateAction, useState } from "react";
import { Apple, Google, LoadingDots } from "@/components/shared/icons";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/types/i18next-lng";

export default function ThirdPartyAccount({
  approved,
  setShowAgreementDialog,
  lng,
}: {
  approved: boolean;
  setShowAgreementDialog: Dispatch<SetStateAction<boolean>>;
} & LngProps) {
  const { t } = useTranslation(lng, "login");

  const [googleClicked, setGoogleClicked] = useState(false);
  const [appleClicked, setAppleClicked] = useState(false);

  return (
    <div className="flex flex-row justify-center gap-3.5 space-y-0">
      <button
        disabled={googleClicked}
        className={`${
          googleClicked
            ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
            : "border border-gray-200 bg-white text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-700"
        } flex h-10 flex-1 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
        onClick={() => {
          if (!approved) {
            setShowAgreementDialog(true);
            return;
          }
          // setGoogleClicked(true);
          // signIn("google", {
          //   ...(callbackUrl ? { callbackUrl } : {}),
          // }).finally(() => {
          //   setGoogleClicked(false);
          // });
        }}
      >
        {googleClicked ? <LoadingDots /> : <Google className="h-5 w-5" />}
      </button>
      <button
        disabled={appleClicked}
        className={`${
          appleClicked
            ? "cursor-not-allowed border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700"
            : "border border-gray-200 bg-white text-black hover:bg-gray-50 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-700"
        } flex h-10 flex-1 items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
        onClick={() => {
          if (!approved) {
            setShowAgreementDialog(true);
            return;
          }
          // setAppleClicked(true);
          // signIn("apple", {
          //   ...(callbackUrl ? { callbackUrl } : {}),
          // }).finally(() => {
          //   setAppleClicked(false);
          // });
        }}
      >
        {appleClicked ? <LoadingDots /> : <Apple className="h-5 w-5" />}
      </button>
    </div>
  );
}
