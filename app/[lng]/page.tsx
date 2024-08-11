"use client";
import { useCallback } from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { RoughNotation } from "react-rough-notation";
import { Gamepad2, Mail, Music } from "lucide-react";
import {
  SiTaobao,
  SiSpotify,
  SiSinaweibo,
  SiInstagram,
  SiYoutube,
  SiTwitch,
  SiTwitter,
  SiTelegram,
} from "react-icons/si";
import { MdOutlineNotificationsActive, MdJoinInner } from "react-icons/md";
// import { BiTestTube } from "react-icons/bi";
import { FaBlog } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Github } from "@/components/shared/icons";
import { useTranslation } from "@/i18n/client";
import { basePath } from "@/constants";
import { allPosts } from "contentlayer/generated";

const DynamicCard = dynamic(() => import("@/components/home/card"), {
  ssr: false,
});

export default function Home({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "common");
  const { t: th } = useTranslation(params.lng, "header");
  const post = allPosts
    .filter((post) => post.slug.startsWith(`${params.lng}/blog`))
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .at(0);

  const Section = useCallback(
    ({ title, links }: { title: string; links: any[] }) => {
      return (
        <div className="mt-14 w-full max-w-screen-xl animate-fade-up px-5 xl:px-0">
          <div className="flex flex-row flex-nowrap items-center justify-center text-center text-3xl before:mr-5 before:h-[1px] before:max-w-xs before:flex-1 before:border-b-[1px] before:border-dashed before:border-b-gray-300 before:content-[''] after:ml-5 after:h-[1px] after:max-w-xs after:flex-1 after:border-b-[1px] after:border-dashed after:border-b-gray-300 after:content-[''] dark:before:border-b-gray-600 dark:after:border-b-gray-600">
            {title}
          </div>
          <div className="mt-6 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {links.map(({ title, description, demo, url }) => (
              <DynamicCard
                key={title}
                title={title}
                description={description}
                demo={demo}
                url={url}
              />
            ))}
          </div>
        </div>
      );
    },
    [],
  );

  return (
    <div className="my-16 w-full max-w-screen-xl">
      <div className="mx-auto w-full max-w-xl px-5 xl:px-0">
        {post && (
          <Link
            href={`/${post.slug}`}
            rel="noreferrer"
            className="mx-auto mb-12 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-[#ff7979] bg-opacity-10 px-7 py-2 text-[#ff7979] transition-colors hover:bg-opacity-20 dark:bg-opacity-20 dark:hover:bg-opacity-30"
          >
            <FaBlog className="h-5 w-5" />
            <p className="text-sm font-semibold">{post.title}</p>
          </Link>
        )}
        <div className="mb-8 flex items-center justify-center space-x-20">
          <Image
            className="rounded-full"
            alt="logo"
            src={`${basePath}/logo.jpg`}
            width={160}
            height={160}
          />
        </div>
        <h1
          className="font-display animate-fade-up bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-black/80 opacity-0 drop-shadow-sm dark:text-white/80 md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>{th("title")}</Balancer>
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-[#ff7979] opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>
            <RoughNotation
              animate
              type="highlight"
              show={true}
              color="#c7ecee"
              animationDelay={1000}
              animationDuration={2500}
            >
              童话镇里一枝花, 人美歌甜陈一发.
            </RoughNotation>
          </Balancer>
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <Link
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800 dark:bg-black dark:text-white/80"
            href="https://github.com/cyf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>
              <span className="sm:inline-block">Star on GitHub</span>
            </p>
          </Link>
          <Link
            href={`/${params.lng}/admin`}
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-[#ff7979] bg-white px-5 py-2 text-sm text-[#ff7979] shadow-md transition-colors hover:border-gray-800 dark:bg-black dark:text-[#ff7979] dark:hover:border-gray-800"
            rel="noopener noreferrer"
          >
            <MdJoinInner className="h-5 w-5" />
            <p>
              <span className="sm:inline-block">Join Insider</span>
            </p>
          </Link>
        </div>
      </div>
      <Section title={t("music")} links={musics} />
      <Section title={t("shopping")} links={shoppings} />
      <Section title={t("social")} links={socials} />
      <Section title={t("live")} links={lives} />
      <Section title={t("app")} links={apps} />
    </div>
  );
}

const musics = [
  {
    title: "Music",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
    demo: (
      <Music className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://chenyifaer.com/music",
  },
  {
    title: "Spotify",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <SiSpotify className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://open.spotify.com/artist/10xtjTRMlKZ7aFx6VBQlSj",
  },
];

const shoppings = [
  {
    title: "Taobao",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
    demo: (
      <SiTaobao className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://chenyifaer.taobao.com",
  },
];

const socials = [
  {
    title: "Instagram",
    description:
      "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
    demo: (
      <SiInstagram className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://instagram.com/yifaer_chen",
  },
  {
    title: "Weibo",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <SiSinaweibo className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://weibo.com/u/7357828611",
  },
  {
    title: "Twitter",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <SiTwitter className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://twitter.com/yifaer_chen",
  },
  {
    title: "Telegram",
    description: "直播通知群.",
    demo: (
      <SiTelegram className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://t.me/FaFa67373",
  },
  {
    title: "Email",
    description:
      "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
    demo: (
      <Mail className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "mailto:chenyifaer777@gmail.com",
  },
];

const lives = [
  {
    title: "YouTube",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <SiYoutube className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://www.youtube.com/@chenyifaer",
  },
  {
    title: "Twitch",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
      <SiTwitch className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://www.twitch.tv/thebs_chen",
  },
];

const apps = [
  {
    title: "FaForever",
    description: "一个可以听发姐音乐的桌面客户端.",
    demo: (
      <Music className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://chenyifaer.com/faforever",
  },
  {
    title: "Homing Pigeon",
    description: "一个可以接收直播通知的应用.",
    demo: (
      <MdOutlineNotificationsActive className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://chenyifaer.com/pigeon",
  },
  {
    title: "FaFa Runner",
    description: "一个休闲小游戏",
    demo: (
      <Gamepad2 className="h-24 w-24 text-gray-600 transition-all dark:text-white/80" />
    ),
    url: "https://fafarunner.com",
  },
];
