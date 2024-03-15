"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useLogout } from "@/lib/hooks";
import { cacheTokenKey } from "@/constants";
import type { LngProps } from "@/i18next-lng";

export default function ResetStoreProvider({
  lng,
  children,
}: React.PropsWithChildren & LngProps) {
  const { reset } = useLogout(lng);

  useEffect(() => {
    const token = Cookies.get(cacheTokenKey);
    if (!token) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
}
