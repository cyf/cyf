"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { MdLiveTv } from "react-icons/md";
import { BiTestTube } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { KnockFeedProvider } from "@knocklabs/react-notification-feed";
import { useScroll, useUserUuid } from "@/lib/hooks";
import LngDropdown from "./lng-dropdown";
import ThemeDropdown from "./theme-dropdown";
import NotificationFeed from "../feed/notification-feed";
import { LngProps } from "@/i18next-lng";
import { useTranslation } from "@/i18n/client";
import { notify } from "@/lib/api";

export default function Header(props: LngProps) {
  const { userId, isLoading, isError } = useUserUuid();
  const { systemTheme } = useTheme();
  const { t } = useTranslation(props.lng, "header");
  const scrolled = useScroll(50);
  const router = useRouter();

  // toggle menu
  const toggleMenu = () => {
    const $navbar = document.querySelector("#navbar-language");
    $navbar?.classList.toggle("hidden");
  };

  const sendMessage = async () => {
    await notify({ message: "message", showToast: true, userId });
  };

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
        <div
          className="w-18 hidden items-center justify-between max-md:absolute max-md:right-5 max-md:top-16 md:order-1 md:flex md:w-auto"
          id="navbar-language"
        >
          <ul className="flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 md:mt-0 md:flex-row md:space-x-0 md:border-0 md:p-0">
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <button
                onClick={() =>
                  router.push("https://www.chenyifaer.com/fafa-runner")
                }
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
              >
                <IoGameControllerOutline className="h-5 w-5" />
              </button>
            </li>
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <button
                onClick={() => router.push("https://www.chenyifaer.com/join")}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
              >
                <BiTestTube className="h-5 w-5" />
              </button>
            </li>
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <button
                onClick={() => {
                  router.push(`/${props.lng}/live`);
                  toggleMenu();
                }}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
              >
                <MdLiveTv className="h-5 w-5" />
              </button>
            </li>
            {!isLoading && !isError && (
              <KnockFeedProvider
                userId={userId}
                apiKey={process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY}
                feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID}
                colorMode={systemTheme}
              >
                <li className="h-8 w-8 sm:h-9 sm:w-9">
                  <NotificationFeed />
                </li>
              </KnockFeedProvider>
            )}
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <button
                onClick={sendMessage}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
              >
                <AiOutlineMessage className="h-5 w-5" />
              </button>
            </li>
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <LngDropdown lng={props.lng} />
            </li>
            <li className="h-8 w-8 sm:h-9 sm:w-9">
              <ThemeDropdown lng={props.lng} />
            </li>
          </ul>
        </div>
        <button
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="navbar-language"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="h-5 w-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
