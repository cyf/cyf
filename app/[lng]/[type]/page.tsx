import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";
import PostItem from "@/components/post/post-item";
import LatestPosts from "@/components/post/latest-posts";
// import Topics from "@/components/post/topics";
import type { Metadata } from "next";

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string };
}): Promise<Metadata | undefined> {
  return {
    title: lng === "en" ? "Blog" : "博客",
    description: `${
      lng === "en" ? "Blog" : "博客"
    } - 童话镇里一枝花, 人美歌甜陈一发.`,
    metadataBase: new URL("https://chenyifaer.com"),
    icons: {
      icon: "/blog/logo.jpg",
    },
  };
}

export default async function Blog({
  params: { lng, type },
}: {
  params: { lng: string; type: string };
}) {
  if (!["blog", "legal"].includes(type)) return notFound();

  // Sort posts by date
  const posts = allPosts
    .filter((post) => post.slug.startsWith(`${lng}/${type}`))
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    });

  return (
    <div className="z-10 my-16 w-full max-w-6xl px-4 sm:px-6">
      <div className="pb-12 md:pb-20">
        {/* Page header */}
        <div className="pb-12 text-center md:pb-20 md:text-left">
          <h1 className="h1 mb-4 text-center text-5xl font-bold">Blog</h1>
          {/*<p className="text-xl text-gray-600">*/}
          {/*  Stay up to date on the latest from Simple and best news from the Dev*/}
          {/*  world.*/}
          {/*</p>*/}
        </div>

        {/* Main content */}
        <div className="md:flex md:justify-between">
          {/* Articles container */}
          <div className="-mt-4 md:grow">
            {posts.map((post, postIndex) => (
              <PostItem key={postIndex} {...post} lng={lng} />
            ))}
          </div>

          {/* Sidebar */}
          {posts.length && (
            <aside className="relative mt-12 md:ml-12 md:mt-0 md:w-64 md:shrink-0 lg:ml-20">
              <LatestPosts posts={posts.slice(0, 5)} />
              {/*<Topics />*/}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
