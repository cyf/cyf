"use client";
import { usePathname } from "next/navigation";
import eventBus from "@/lib/event-bus";
import { domain } from "@/constants";

export default function useLogout(lng: string) {
  const pathname = usePathname();

  return () => {
    eventBus.emit("logout", `${domain}/${lng}/login?r=${domain}${pathname}`);
  };
}
