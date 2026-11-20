import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPost, CATEGORIES } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import { host } from "../../PostCard";
import { SITE } from "@/lib/site";

function contactHref(c) {
  if (/^\S+@\S+\.\S+$/.test(c)) return `mailto:${c}`;
  const digits = c.replace(/[^\d]/g, "");
  if (digits.length >= 10) return `https://wa.me/${digits}`;
  return null;
}

async function load(params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return null;
  if (post.status !== "approved" && !(await isAdmin())) return null;
  return post;
}

export async function generateMetadata({ params }) {
  const post = await load(params);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.body.slice(0, 155) };
}

async function Post({ params }) {
  const post = await load(params);
  if (!post) notFound();
  const href = contactHref(post.contact);
  const facts = [
    ["Website", post.url && <a href={post.url} rel="nofollow ugc noopener" target="_blank" className="text-emerald-800 underline">{host(post.url)}</a>],
    ["DA / DR", post.da],
    ["Traffic", post.traffic],
    [post.category === "wanted" ? "Budget" : post.category === "writers" ? "Rate" : "Price", post.price],
    ["Niche", post.niche],
  ].filter(([, v]) => v);

  return (
    <article className="max-w-2xl">
      {post.status !== "approved" && (
        <p className="mb-4 rounded bg-yellow-100 p-2 text-sm">Admin preview — status: {post.status}</p>
      )}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-800">{CATEGORIES[post.category]?.label}</span>
        {post.featured && <span className="font-semibold text-amber-600">★ Checked by {SITE.name}</span>}
      </div>
      <h1 className="mt-3 text-2xl sm:text-3xl font-bold">{post.title}</h1>
      <p className="mt-1 text-sm text-stone-500">
        {post.name ? `By ${post.name} · ` : ""}
        {new Date(post.createdAt).toLocaleDateString("en-GB")}
      </p>
      {facts.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:grid-cols-3">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase text-stone-500">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-6 whitespace-pre-line leading-relaxed">{post.body}</div>
      <div className="mt-8 rounded-xl border border-stone-200 bg-white p-4">
        <p className="text-sm text-stone-500">Contact</p>
        {href ? (
          <a href={href} rel="nofollow noopener" className="mt-1 inline-block rounded-full bg-emerald-900 px-5 py-2 font-semibold text-white">
            {post.contact}
          </a>
        ) : (
          <p className="mt-1 font-medium">{post.contact}</p>
        )}
        <p className="mt-3 text-xs text-stone-500">Deal directly with the poster. Check the site and get proof before paying.</p>
      </div>
    </article>
  );
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<p className="text-stone-500">Loading…</p>}>
      <Post params={params} />
    </Suspense>
  );
}
