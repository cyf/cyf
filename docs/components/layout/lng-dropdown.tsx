"use client";
import { useState } from "react";
import { RiTranslate } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { languages } from "@/i18n/settings";
import { LngProps } from "@/i18next-lng";

export default function LngDropdown(props: LngProps) {
  const { t } = useTranslation(props.lng, "header");
  const pathName = usePathname();
  const [openPopover, setOpenPopover] = useState(false);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu open={openPopover} onOpenChange={setOpenPopover}>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9">
            <RiTranslate className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="w-full min-w-[14rem] rounded-md bg-white p-2 dark:bg-black">
            {languages.map((locale) => {
              return (
                <DropdownMenuItem key={locale} disabled={locale === props.lng}>
                  <Link
                    key={locale}
                    href={redirectedPathName(locale)}
                    className="relative flex w-full items-center justify-start space-x-2 rounded-md py-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <p className="text-sm">{t(`languages.${locale}`)}</p>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
