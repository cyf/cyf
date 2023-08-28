"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RiTranslate } from "react-icons/ri";
import { MdAutoMode } from "react-icons/md";
import type { IconType } from "react-icons";
import Popover from "@/components/shared/popover";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useTranslation } from "@/i18n/client";
import { languages } from "@/i18n/settings";
import { LngProps } from "@/i18next-lng";
import { themes, icons, Theme, ThemeMode } from "@/theme";

export default function ThemeDropdown(props: LngProps) {
  const router = useRouter();
  const { t } = useTranslation(props.lng);
  const { theme, setTheme } = useTheme();
  const [openPopover, setOpenPopover] = useState(false);

  const ThemeIcon: IconType = useMemo(() => {
    return icons[(theme || "system") as ThemeMode] || MdAutoMode;
  }, [theme]);

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 dark:bg-black sm:w-56">
            {themes.map((t: Theme) => {
              return (
                <button
                  key={t.mode}
                  onClick={() => setTheme(t.mode)}
                  className={`relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    theme === t.mode
                      ? "cursor-not-allowed bg-gray-100 dark:bg-gray-700"
                      : ""
                  }`}
                >
                  <t.icon className="mr-2" />
                  <p className="text-sm">{t.name}</p>
                </button>
              );
            })}
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
      </Popover>
    </div>
  );
}
