"use client";

import Image from "next/image";
import { LngProps } from "@/i18next-lng";
import { useTranslation } from "@/i18n/client";

export default function Footer(props: LngProps) {
  const { t } = useTranslation(props.lng, "footer");
  return (
    <div className="absolute w-full border-b border-gray-200 py-5 text-center">
      <p className="text-gray-500 dark:text-white/80">
        {t("footer")}{" "}
        <a
          className="font-medium text-gray-800 underline transition-colors dark:text-white/90"
          href="https://github.com/cyf/cyf.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
      <p className="mt-2 flex items-center justify-center">
        <a
          className="font-medium text-gray-800 underline transition-colors dark:text-white/90"
          href="https://chenyifaer.com/fafa-runner/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        &nbsp;&nbsp;
        <a
          className="font-medium text-gray-800 underline transition-colors dark:text-white/90"
          href="https://chenyifaer.com/fafa-runner/terms-of-use"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms &amp; Conditions
        </a>
      </p>
      <p className="mt-2 flex items-center justify-center">
        <Image
          src="https://visitor-badge.laobi.icu/badge?page_id=chenyifaer.com"
          width={60}
          height={20}
          alt="visitor badge"
        />
      </p>
    </div>
  );
}
