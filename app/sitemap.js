import { connection } from "next/server";
import { listPosts } from "@/lib/store";
import { SITE } from "@/lib/site";

export default async function sitemap() {
  await connection();
  const posts = (await listPosts()).filter((p) => p.status === "approved");
  return [
    { url: `${SITE.url}/` },
    { url: `${SITE.url}/new` },
    ...posts.map((p) => ({ url: `${SITE.url}/p/${p.id}`, lastModified: new Date(p.createdAt) })),
  ];
}
