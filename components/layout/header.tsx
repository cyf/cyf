"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdLiveTv } from "react-icons/md";
import useScroll from "@/lib/hooks/use-scroll";
import LngDropdown from "./lng-dropdown";
import ThemeDropdown from "./theme-dropdown";
import { LngProps } from "@/i18next-lng";
import { useTranslation } from "@/i18n/client";

export default function Header(props: LngProps) {
  const { t } = useTranslation(props.lng, "header");
  const scrolled = useScroll(50);
  const router = useRouter();

  return (
    <div
      className={`fixed top-0 w-full ${
        scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900"
          : "bg-white/0 dark:bg-black/0"
      } z-30 transition-all`}
    >
      <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
        <Link
          href={`/${props.lng}`}
          className="flex items-center font-display text-2xl"
        >
          <Image
            src="/portal/logo.jpg"
            alt="logo"
            width="30"
            height="30"
            className="mr-2 rounded-sm"
          ></Image>
          <p>{t("title")}</p>
        </Link>
        <div>
          <div className="relative inline-block text-left">
            <button
              onClick={() => router.push(`/${props.lng}/live`)}
              className="mr-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
            >
              <MdLiveTv className="h-5 w-5" />
            </button>
          </div>
          <LngDropdown lng={props.lng} />
          <ThemeDropdown lng={props.lng} />
        </div>
      </div>
    </div>
  );
}
