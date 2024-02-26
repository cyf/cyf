"use client";

import dynamic from "next/dynamic";
import { useTranslation } from "@/i18n/client";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Live({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "header");
  return (
    <div className="z-10 h-full w-full px-5 xl:px-0">
      {/*https://yuanbao.chatcyf.com/hls/chatcyf.m3u8*/}
      {/*http://streamer1.streamhost.org:1935/salive/GMIlcbgM/playlist.m3u8*/}
      <ReactPlayer
        url="https://yuanbao.chatcyf.com/hls/chatcyf.m3u8"
        volume={0.5}
        width="100%"
        height="100%"
        pip={true}
        controls={true}
      />
    </div>
  );
}
