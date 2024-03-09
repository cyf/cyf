"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToastAction } from "@/components/ui/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/i18n/client";
import { selectUser, setUserAsync } from "@/model/slices/user/slice";
import { useAppSelector, useAppDispatch } from "@/model/hooks";
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
  const { t: tv } = useTranslation(params.lng, "verify");
  const socketRef = useRef<Socket>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && socketRef?.current) {
      // Listen for incoming messages
      const event = crypto.encrypt(user.id);
      socketRef.current?.on(event, (message) => {
        console.log("receive verified", message);
        dispatch(setUserAsync());
      });
    }
  }, [user, socketRef?.current]);

  useEffect(() => {
    if (!WS_BASE_URL) return;

    // Create a socket connection
    socketRef.current = io(WS_BASE_URL);

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
  }, []);

  const sendMessage = () => {
    // Send the message to the server
    // socketRef.current?.emit("hello2", "222222", (res: any) => {
    //   console.log("emit hello2: ", res);
    // });
  };

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
              title: tv("verify_email_sent"),
              action: (
                <ToastAction
                  className="focus:ring-0 focus:ring-offset-0"
                  altText="Goto schedule to undo"
                >
                  {t("confirm")}
                </ToastAction>
              ),
            });
            return;
          }
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="w-full">
          <span>Verify Page</span>
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt="avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>
            {user?.nickname}({user?.id})
          </span>
        </div>
        {/* Button to submit the new message */}
        <button onClick={sendEmail}>Send Email</button>
      </div>
    </>
  );
}
