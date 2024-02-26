import RSS from "rss";
import { allPosts } from "contentlayer/generated";
import { domain } from "@/constants";
import { languages } from "@/i18n/settings";

const rssPages = ["/blog"];

export async function GET() {
  const feed = new RSS({
    title: "Blog posts | RSS Feed",
    description: "Welcome to blog posts!",
    site_url: domain,
    feed_url: `${domain}/rss.xml`,
    image_url: `${domain}/logo.jpg`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, @kjxbyz`,
  });
  const rssPageRegex = RegExp(
    `^(/(${languages.join("|")}))?(${rssPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?`,
    "i",
  );

  allPosts
    .filter((post) => rssPageRegex.test(`/${post.slug}`))
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .map((post) => {
      feed.item({
        title: post.title,
        description: post.summary || "",
        author: post.author,
        url: `${domain}/${post.slug}`,
        date: post.publishedAt,
      });
    });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
