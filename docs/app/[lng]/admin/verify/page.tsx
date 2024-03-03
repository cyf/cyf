"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useTranslation } from "@/i18n/client";
import { useAppSelector, selectUser } from "@/model";
import { userService } from "@/services";
import type { Socket } from "socket.io-client";

const WS_BASE_URL = process.env.WS_BASE_URL;

export default function User({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "login");
  const socketRef = useRef<Socket>();
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!WS_BASE_URL) return;

    // Create a socket connection
    socketRef.current = io(WS_BASE_URL);

    // Listen for incoming messages
    socketRef.current?.on("hello2", (message) => {
      console.log("receive hello2", message);
    });

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
      .verify()
      .then((res: any) => {
        console.log(res);
        setLoading(false);
        if (res?.code === 0) {
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
          <br />
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
