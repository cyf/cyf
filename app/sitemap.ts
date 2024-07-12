import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { domain, sitemapUrls } from "@/constants";
import { languages } from "@/i18n/settings";

export default function sitemap(): MetadataRoute.Sitemap {
  let sitemaps = allPosts
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .filter((post) => post.slug.startsWith("en/"))
    .map((post) => ({
      url: `${domain}/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    }));

  sitemaps = sitemaps.concat(
    sitemapUrls.flatMap((url: string) => {
      return languages
        .filter((language) => language === "en")
        .map((lng: string) => ({
          url: `${domain}/${lng}/${url}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 1,
        }));
    }),
  );

  return sitemaps as MetadataRoute.Sitemap;
}
