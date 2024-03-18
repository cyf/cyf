"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { CirclePlus, TableProperties, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/client";
import { useLogout } from "@/lib/hooks";
import type { LngProps } from "@/i18next-lng";
import type { User } from "@/entities/user";

export default function AvatarDropdown(props: { user: User } & LngProps) {
  const { user, lng } = props;
  const { logout } = useLogout(lng);
  const { t: tm } = useTranslation(lng, "menu");
  const { t: tl } = useTranslation(lng, "login");
  const [openPopover, setOpenPopover] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  // 根据内容判断是否显示的页面内组件
  const ShowContent = useCallback(
    ({
      isShow,
      children,
    }: {
      isShow: boolean;
      children: React.ReactElement;
    }) => (isShow ? children : null),
    [],
  );

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu open={openPopover} onOpenChange={setOpenPopover}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            className="hidden h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 sm:h-9 sm:w-9 md:flex"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ""} alt={user.username} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="w-full min-w-[14rem] rounded-md bg-white p-2 dark:bg-black">
            <DropdownMenuLabel>{tm("menus")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href={`/${lng}/admin`}
                className="relative flex w-full items-center justify-start space-x-2 rounded-md py-2 text-left text-sm transition-all duration-75"
              >
                <CirclePlus className="mr-0 h-4 w-4" />
                <p className="text-sm">{tm("insider-program")}</p>
              </Link>
            </DropdownMenuItem>
            <ShowContent isShow={user?.role === "ADMIN"}>
              <DropdownMenuItem>
                <Link
                  href={`/${lng}/admin/dictionary`}
                  className="relative flex w-full items-center justify-start space-x-2 rounded-md py-2 text-left text-sm transition-all duration-75"
                >
                  <TableProperties className="mr-0 h-4 w-4" />
                  <p className="text-sm">{tm("data-dictionary")}</p>
                </Link>
              </DropdownMenuItem>
            </ShowContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                onClick={() => {
                  setOpenPopover(false);
                  logout();
                }}
                className="relative flex w-full items-center justify-start space-x-2 rounded-md py-2 text-left text-sm transition-all duration-75"
              >
                <LogOut className="mr-0 h-4 w-4" />
                <p className="text-sm">{tl("logout")}</p>
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerTrigger asChild>
          <Button
            variant="link"
            className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full transition-all duration-75 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95 sm:h-9 sm:w-9 md:hidden"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || ""} alt={user.username} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="min-w-sm mx-auto w-full rounded-md p-2">
            <DrawerHeader className="px-2">
              <DrawerTitle className="text-center">{tm("menus")}</DrawerTitle>
            </DrawerHeader>
            <Link
              href={`/${lng}/admin`}
              className="relative flex w-full items-center justify-start space-x-2 rounded-md px-2 py-3 text-left text-sm transition-all duration-75 hover:bg-accent hover:text-accent-foreground"
            >
              <CirclePlus className="mr-0 h-4 w-4" />
              <p className="text-sm">{tm("insider-program")}</p>
            </Link>
            <ShowContent isShow={user?.role === "ADMIN"}>
              <Link
                href={`/${lng}/admin/dictionary`}
                className="relative flex w-full select-none items-center justify-start space-x-2 rounded-md px-2 py-3 text-left text-sm transition-all duration-75 hover:bg-accent hover:text-accent-foreground"
              >
                <TableProperties className="mr-0 h-4 w-4" />
                <p className="text-sm">{tm("data-dictionary")}</p>
              </Link>
            </ShowContent>
            <Button
              onClick={() => {
                setOpenDrawer(false);
                logout();
              }}
              className="relative flex w-full items-center justify-start space-x-2 rounded-md bg-background px-2 py-3 text-left text-sm text-inherit transition-all duration-75 hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="mr-0 h-4 w-4" />
              <p className="text-sm">{tl("logout")}</p>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
