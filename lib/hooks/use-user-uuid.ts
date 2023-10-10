"use client";
import { useEffect } from "react";
import useSWR from "swr";
import { identify } from "@/lib/api";
import { currentUserIdKey, currentUserNameKey } from "@/constants";
import { useLocalStorage } from "@/lib/hooks";

export default function useUserUuid() {
  const [userId, setUserId] = useLocalStorage<string>(currentUserIdKey, "");
  const [userName, setUserName] = useLocalStorage<string>(
    currentUserNameKey,
    "",
  );
  const { data, error } = useSWR(
    ["/portal/api/identify", userId],
    () => identify({ id: userId, name: userName }),
    { revalidateOnFocus: false, revalidateOnMount: false },
  );

  useEffect(() => {
    if (
      (!userId || !userName) &&
      data?.user &&
      (userId != data?.user.id || userName != data?.user.name)
    ) {
      setUserId(data?.user?.id);
      setUserName(data?.user?.name);
    }
  }, [userId, userName, data, setUserId, setUserName]);

  return {
    userId,
    userName,
    isLoading: !error && !data,
    isError: error,
  };
}
