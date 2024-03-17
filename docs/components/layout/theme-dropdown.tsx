"use client";
import { useState, useMemo } from "react";
import { MdOutlineDesktopMac } from "react-icons/md";
import type { IconType } from "react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppTheme } from "@/lib/hooks";
import { useTranslation } from "@/i18n/client";
import { LngProps } from "@/i18next-lng";
import { themes, icons, Theme, ThemeMode } from "@/theme";

export default function ThemeDropdown(props: LngProps) {
  const { t } = useTranslation(props.lng, "header");
  const { theme, setTheme } = useAppTheme();
  const [openPopover, setOpenPopover] = useState(false);

  const ThemeIcon: IconType = useMemo(() => {
    return icons[theme as ThemeMode] || MdOutlineDesktopMac;
  }, [theme]);

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu open={openPopover} onOpenChange={setOpenPopover}>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9">
            <ThemeIcon className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="w-full min-w-[14rem] rounded-md bg-white p-2 dark:bg-black">
            {themes.map((t1: Theme) => {
              return (
                <DropdownMenuItem key={t1.mode} disabled={theme === t1.mode}>
                  <button
                    key={t1.mode}
                    onClick={() => setTheme(t1.mode)}
                    className="relative flex w-full items-center justify-start space-x-2 rounded-md py-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <t1.icon className="mr-0 h-4 w-4" />
                    <p className="text-sm">{t(`menus.${t1.mode}`)}</p>
                  </button>
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
