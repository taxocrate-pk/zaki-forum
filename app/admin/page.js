import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { isAdmin } from "@/lib/auth";
import { listPosts, CATEGORIES } from "@/lib/store";
import { moderate, logout } from "../actions";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin", robots: { index: false } };

function Btn({ id, op, children, cls }) {
  return (
    <form action={moderate}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="op" value={op} />
      <button className={`rounded-full px-3 py-1 text-sm font-medium ${cls}`}>{children}</button>
    </form>
  );
}

async function Admin() {
  await connection();
  if (!(await isAdmin())) return <LoginForm />;
  const posts = await listPosts();
  const groups = ["pending", "approved", "rejected"];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Moderation</h1>
        <form action={logout}><button className="text-sm underline">Log out</button></form>
      </div>
      {groups.map((g) => {
        const list = posts.filter((p) => p.status === g);
        return (
          <section key={g} className="mt-8">
            <h2 className="mb-3 font-semibold capitalize">{g} ({list.length})</h2>
            <div className="space-y-3">
              {list.map((p) => (
                <div key={p.id} className="rounded-xl border border-stone-200 bg-white p-4">
                  <div className="text-xs text-stone-500">
                    {CATEGORIES[p.category]?.label} · {new Date(p.createdAt).toLocaleString("en-GB")} · {p.contact}
                    {p.featured && <span className="ml-2 font-semibold text-amber-600">★</span>}
                  </div>
                  <Link href={`/p/${p.id}`} className="mt-1 block font-semibold underline">{p.title}</Link>
                  <p className="mt-1 line-clamp-3 text-sm text-stone-600">{p.body}</p>
                  {p.url && <p className="mt-1 text-sm text-stone-600">{p.url}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g !== "approved" && <Btn id={p.id} op="approve" cls="bg-emerald-800 text-white">Approve</Btn>}
                    {g !== "rejected" && <Btn id={p.id} op="reject" cls="bg-red-100 text-red-800">Reject</Btn>}
                    {g !== "pending" && <Btn id={p.id} op="pending" cls="bg-stone-100">Back to pending</Btn>}
                    <Btn id={p.id} op="star" cls="bg-amber-100 text-amber-800">{p.featured ? "Remove ★" : "Give ★"}</Btn>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Admin />
    </Suspense>
  );
}
