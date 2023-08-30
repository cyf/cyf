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
    <div className="z-10">
      <ReactPlayer
        url="https://www.kjxbyz.com/starter/next/videos/video.mp4"
        volume={0.5}
        width="100%"
        height="100%"
        controls={true}
      />
    </div>
  );
}
