import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { listPosts, CATEGORIES } from "@/lib/store";
import PostCard from "./PostCard";

async function Listings({ searchParams }) {
  await connection();
  const { c } = await searchParams;
  const all = (await listPosts()).filter((p) => p.status === "approved");
  const posts = (CATEGORIES[c] ? all.filter((p) => p.category === c) : all).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt
  );
  return (
    <>
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        <Tab href="/" active={!CATEGORIES[c]}>All ({all.length})</Tab>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <Tab key={k} href={`/?c=${k}`} active={c === k}>
            {v.label} ({all.filter((p) => p.category === k).length})
          </Tab>
        ))}
      </nav>
      {posts.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
          Nothing here yet. <Link href="/new" className="text-emerald-800 underline">Be the first to post</Link>.
        </p>
      )}
    </>
  );
}

function Tab({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 ${
        active ? "bg-emerald-900 text-white" : "bg-white border border-stone-200 hover:border-stone-400"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Home({ searchParams }) {
  return (
    <>
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Guest post sites, buyers and writers in one place
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          List your site, find blogs that accept guest posts, or offer your writing. Posting is free.
          Each listing is reviewed before it appears, and sites we have checked get a ★.
        </p>
      </section>
      <Suspense fallback={<p className="text-stone-500">Loading…</p>}>
        <Listings searchParams={searchParams} />
      </Suspense>
    </>
  );
}
