"use client";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { persistStore } from "@/model/store";
import { cacheIdKey, cacheTokenKey, domain } from "@/constants";

export default function useLogout(lng: string) {
  const pathname = usePathname();

  const logout = () => {
    persistStore.pause();
    persistStore.flush().then(() => {
      const res = persistStore.purge();
      Cookies.remove(cacheTokenKey);
      Cookies.remove(cacheIdKey);
      window.location.replace(`${domain}/${lng}/login?r=${domain}${pathname}`);
      return res;
    });
  };

  const reset = async () => {
    persistStore.pause();
    persistStore
      .flush()
      .then(() => {
        return persistStore.purge();
      })
      .then(() => {
        Cookies.remove(cacheTokenKey);
        Cookies.remove(cacheIdKey);
      });
  };

  return {
    logout,
    reset,
  };
}
