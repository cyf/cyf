"use client";
import { useState } from "react";
import { MdLogout } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Popover from "@/components/shared/popover";
import { useTranslation } from "@/i18n/client";
import { useLogout } from "@/lib/hooks";
import type { LngProps } from "@/i18next-lng";
import type { User } from "@/entities/user";

export default function AvatarDropdown(props: { user: User } & LngProps) {
  const { user, lng } = props;
  const logout = useLogout(lng);
  const { t: tl } = useTranslation(lng, "login");
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <Popover
        content={
          <div className="w-full min-w-[14rem] rounded-md bg-white p-2 dark:bg-black">
            <button
              onClick={() => {
                setOpenPopover(false);
                logout();
              }}
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdLogout className="mr-2" />
              <p className="text-sm">{tl("logout")}</p>
            </button>
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
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={user.username} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </Popover>
    </div>
  );
}
