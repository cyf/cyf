"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { setUserAsync, selectUser } from "@/model/slices/user/slice";
import { useAppDispatch, useAppSelector } from "@/model/hooks";
import { domain } from "@/constants";
import { languages } from "@/i18n/settings";
import type { LngProps } from "@/types/i18next-lng";

const ignoreRedirectPages = ["/admin/verify"];

const ignorePathnameRegex = RegExp(
  `^(/(${languages.join("|")}))?(${ignoreRedirectPages
    .flatMap((p) => (p === "/" ? ["", "/"] : p))
    .join("|")})/?$`,
  "i",
);

export default function UserProvider({
  children,
  lng,
}: {
  children: React.ReactNode;
} & LngProps) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const redirectUrl = search.get("r");
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const initialized = useRef(false);
  if (!user && !initialized.current) {
    initialized.current = true;
    dispatch(setUserAsync());
  }

  useEffect(() => {
    if (user && !user?.email_verified && !ignorePathnameRegex.test(pathname)) {
      console.log("verify", domain, pathname);
      router.push(`/${lng}/admin/verify?r=${domain}${pathname}`);
    } else if (
      user &&
      user?.email_verified &&
      ignorePathnameRegex.test(pathname)
    ) {
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        router.push(`/${lng}/admin`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lng, pathname, redirectUrl]);

  return children;
}
