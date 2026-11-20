import Link from "next/link";
import { CATEGORIES } from "@/lib/store";

export function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function PostCard({ post }) {
  return (
    <Link
      href={`/p/${post.id}`}
      className={`block rounded-xl border bg-white p-4 hover:shadow-sm ${
        post.featured ? "border-amber-400 ring-1 ring-amber-300" : "border-stone-200"
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-800">
          {CATEGORIES[post.category]?.label}
        </span>
        {post.featured && <span className="text-amber-600 font-semibold">★ Checked</span>}
        <span className="ml-auto">{new Date(post.createdAt).toLocaleDateString("en-GB")}</span>
      </div>
      <h3 className="mt-2 font-semibold leading-snug">{post.title}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
        {post.url && <span>{host(post.url)}</span>}
        {post.da && <span>DA/DR {post.da}</span>}
        {post.traffic && <span>Traffic {post.traffic}</span>}
        {post.price && <span className="font-medium text-emerald-800">{post.price}</span>}
      </div>
    </Link>
  );
}
