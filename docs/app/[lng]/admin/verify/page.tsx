"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { io } from "socket.io-client";
import { IoIosSend } from "react-icons/io";
import Cookies from "js-cookie";
import { ToastAction } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/i18n/client";
import { useLogout } from "@/lib/hooks";
import { selectUser, setUserAsync } from "@/model/slices/user/slice";
import { useAppSelector, useAppDispatch } from "@/model/hooks";
import { cacheIdKey, cacheTokenKey } from "@/constants";
import { userService } from "@/services";
import * as crypto from "@/utils/crypto";
import type { Socket } from "socket.io-client";

const WS_BASE_URL = process.env.WS_BASE_URL;

export default function User({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "common");
  const { t: tl } = useTranslation(params.lng, "login");
  const { t: tv } = useTranslation(params.lng, "verify");
  const socketRef = useRef<Socket>();
  const dispatch = useAppDispatch();
  const { logout } = useLogout(params.lng);
  const user = useAppSelector(selectUser);
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!WS_BASE_URL) return;

    const token = Cookies.get(cacheTokenKey);
    const id = Cookies.get(cacheIdKey);

    // Create a socket connection
    socketRef.current = io(WS_BASE_URL, {
      extraHeaders: token ? { authorization: `Bearer ${token}` } : undefined,
    });

    socketRef.current?.on("connect", () => {
      console.log("connect");
    });

    if (id) {
      const event = crypto.encrypt(id);
      socketRef.current?.on(event, (data: any) => {
        console.log(`event receive`, data);
        if (data?.verified) {
          dispatch(setUserAsync());
        }
      });
    }

    socketRef.current?.on("exception", (error) => {
      console.error("exception", error);
    });

    socketRef.current?.on("error", (error) => {
      console.error("error", error);
    });

    socketRef.current?.on("reconnect_error", (error) => {
      console.error("reconnect_error", error);
    });

    socketRef.current?.on("reconnect_failed", (error) => {
      console.error("reconnect_failed", error);
    });

    // Clean up the socket connection on unmount
    return () => {
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const sendMessage = () => {
  //   // Send the message to the server
  //   socketRef.current?.emit("hello2", "222222", (res: any) => {
  //     console.log("emit hello2: ", res);
  //   });
  // };

  // const sendMessage = () => {
  //   // Send the message to the server
  //   socketRef.current?.emit("events", "222222", (res: any) => {
  //     console.log("emit events: ", res);
  //   });
  // };

  const sendEmail = async () => {
    setLoading(true);
    await userService
      .send()
      .then((res: any) => {
        setLoading(false);
        console.log(res);
        if (res?.code === 0) {
          if (res?.data?.status === "email_verification_sent") {
            toast({
              title: tv("verify-email-sent"),
              duration: 2000,
              variant: "destructive",
            });
            return;
          }
          toast({
            title: t("succeed"),
            duration: 2000,
            action: (
              <ToastAction
                className="focus:ring-0 focus:ring-offset-0"
                altText="Goto schedule to undo"
              >
                {t("confirm")}
              </ToastAction>
            ),
          });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
        toast({
          title: t("error"),
          duration: 2000,
          variant: "destructive",
          description: error?.msg || t("error-description"),
        });
      });
  };

  return (
    <div className="mt-16 flex h-auto w-full max-w-screen-xl flex-1 px-5 xl:px-0">
      <section className="mx-auto max-w-2xl self-center bg-gray-50 px-6 py-8 dark:bg-gray-900">
        <header>
          <div className="flex justify-center">
            <Link
              className="inline h-24 w-24"
              href="https://www.chenyifaer.com"
            >
              <Image
                className="h-24 w-24 rounded-full"
                width={96}
                height={96}
                src={user?.avatar || ""}
                alt={user?.username || ""}
              />
            </Link>
          </div>
        </header>
        <main className="mt-8">
          <h2 className="mt-6 text-gray-700 dark:text-gray-200">
            {tv("hi")} {user?.nickname || user?.username},
          </h2>
          <p className="mt-2 leading-loose text-gray-600 dark:text-gray-300">
            {tv("description", { expires: 10 })}
            <Link
              className="underline transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
              href="mailto:kjxbyz@163.com"
            >
              {tv("contact-us")}
            </Link>
            .
          </p>
          <div className="my-6">
            <Button
              disabled={loading}
              className="inline-flex w-auto min-w-[150px] items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white shadow transition-colors duration-300 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              onClick={sendEmail}
            >
              <IoIosSend className="h-5 w-5" />
              <span className="mx-2">{tv("send-email")}</span>
            </Button>
            {/*<Button*/}
            {/*  disabled={loading}*/}
            {/*  className="inline-flex w-auto min-w-[150px] items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white shadow transition-colors duration-300 hover:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-80"*/}
            {/*  onClick={sendMessage}*/}
            {/*>*/}
            {/*  <IoIosSend className="h-5 w-5" />*/}
            {/*  <span className="mx-2">Events</span>*/}
            {/*</Button>*/}
          </div>
          <p className="mt-2 text-[14px] leading-loose text-gray-600 dark:text-gray-300">
            {tv("wrong-email")}&nbsp;
            <span
              onClick={logout}
              className="cursor-pointer text-blue-600 dark:text-blue-400"
            >
              {tl("logout")}
            </span>
            {tv("login-again")}
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {tv("thanks")}
            <br />
            <Link
              className="text-blue-600 hover:underline dark:text-blue-400"
              href="https://kjxbyz.com"
            >
              {tv("kjxbyz")}
            </Link>
          </p>
        </main>
      </section>
    </div>
  );
}
