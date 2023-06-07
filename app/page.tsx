import Card from "@/components/home/card";
import Balancer from "react-wrap-balancer";
import { Github } from "@/components/shared/icons";
import { ShoppingBag, Instagram, Youtube, Mail, Gamepad2 } from "lucide-react";
import { FaSpotify, FaWeibo } from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
        <div className="mb-8 flex items-center justify-center space-x-20">
          <Image
            className="rounded-full"
            alt="logo"
            src="/logo.jpg"
            width={160}
            height={160}
          />
        </div>
        <h1
          className="animate-fade-up bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>陈一发儿</Balancer>
        </h1>
        <p
          className="mt-6 animate-fade-up text-center text-gray-500 opacity-0 md:text-xl"
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          <Balancer>童话镇里一枝花, 人美歌甜陈一发.</Balancer>
        </p>
        <div
          className="mx-auto mt-6 flex animate-fade-up items-center justify-center space-x-5 opacity-0"
          style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
        >
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="https://github.com/cyf/cyf.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>
              <span className="sm:inline-block">Star on</span> GitHub{" "}
            </p>
          </a>
        </div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, url }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={demo}
            url={url}
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: "TaoBao",
    description:
      "Pre-built beautiful, a11y-first components, powered by [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Framer Motion](https://framer.com/motion)",
    demo: (
        <ShoppingBag className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://chenyifaer.taobao.com",
  },
  {
    title: "Instagram",
    description:
      "Built on [Next.js](https://nextjs.org/) primitives like `@next/font` and `next/image` for stellar performance.",
    demo: (
        <Instagram className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://instagram.com/yifaer_chen",
  },
  {
    title: "YouTube",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
        <Youtube className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://www.youtube.com/@chenyifaer",
  },
  {
    title: "Spotify",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
        <FaSpotify className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://open.spotify.com/artist/10xtjTRMlKZ7aFx6VBQlSj",
  },
  {
    title: "Weibo",
    description:
      "Jumpstart your next project by deploying Precedent to [Vercel](https://vercel.com/) in one click.",
    demo: (
        <FaWeibo className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://weibo.com/u/7357828611",
  },
  {
    title: "Email",
    description:
      "Precedent comes with authentication and database via [Auth.js](https://authjs.dev/) + [Prisma](https://prisma.io/)",
    demo: (
        <Mail className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "mailto://chenyifaer888@163.com",
  },
  {
    title: "Game",
    description:
      "Precedent offers a collection of hooks, utilities, and `@vercel/og`",
    demo: (
        <Gamepad2 className="h-24 w-24 text-gray-600 transition-all" />
    ),
    url: "https://chenyifaer.com/fafa-runner",
  },
];
