"use client";
import { useActionState, useEffect, useState } from "react";
import { submitPost } from "../actions";

const SECTIONS = [
  ["offer", "Guest Post Sites", "My site accepts guest posts"],
  ["wanted", "Wanted", "I need guest posts / links"],
  ["writers", "Writers", "I write content for others"],
  ["tips", "Tips & Talk", "Advice, questions, discussion"],
];

const input = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-700 focus:outline-none";

export default function NewForm() {
  const [state, action, pending] = useActionState(submitPost, null);
  const [t, setT] = useState(0);
  useEffect(() => setT(Date.now()), []);
  const [cat, setCat] = useState("offer");

  if (state?.ok) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-6">
        <h2 className="font-semibold text-emerald-900">Thanks, your post is in the queue.</h2>
        <p className="mt-1 text-emerald-900">It will appear on the forum once reviewed.</p>
      </div>
    );
  }

  const siteFields = cat === "offer" || cat === "wanted";

  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="t" value={t} readOnly />
      <div className="hidden" aria-hidden="true">
        <label>Company <input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Section</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {SECTIONS.map(([k, label, hint]) => (
            <label
              key={k}
              className={`cursor-pointer rounded-lg border p-3 ${cat === k ? "border-emerald-700 bg-emerald-50" : "border-stone-300 bg-white"}`}
            >
              <input type="radio" name="category" value={k} checked={cat === k} onChange={() => setCat(k)} className="sr-only" />
              <span className="block font-medium">{label}</span>
              <span className="block text-sm text-stone-500">{hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium">
        Title
        <input name="title" required minLength={8} maxLength={120} className={input}
          placeholder={cat === "wanted" ? "Need tech blogs, DA 40+, do-follow" : "Health blog accepting guest posts, DA 45"} />
      </label>

      {siteFields && (
        <>
          <label className="block text-sm font-medium">
            Website URL
            <input name="url" maxLength={300} className={input} placeholder="example.com" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium">
              DA / DR
              <input name="da" maxLength={20} className={input} placeholder="45" />
            </label>
            <label className="block text-sm font-medium">
              Monthly traffic
              <input name="traffic" maxLength={40} className={input} placeholder="20k" />
            </label>
            <label className="block text-sm font-medium">
              {cat === "wanted" ? "Budget" : "Price"}
              <input name="price" maxLength={40} className={input} placeholder="$50" />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Niche
            <input name="niche" maxLength={80} className={input} placeholder="Health, Tech, Finance…" />
          </label>
        </>
      )}

      {cat === "writers" && (
        <label className="block text-sm font-medium">
          Rate
          <input name="price" maxLength={40} className={input} placeholder="$10 per 1000 words" />
        </label>
      )}

      <label className="block text-sm font-medium">
        Details
        <textarea name="body" required minLength={30} maxLength={3000} rows={6} className={input}
          placeholder="Do-follow or no-follow, turnaround time, rules, samples…" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Your name
          <input name="name" maxLength={60} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Email or WhatsApp
          <input name="contact" required maxLength={120} className={input} placeholder="you@mail.com or +92…" />
        </label>
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{state.error}</p>}

      <button disabled={pending} className="rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">
        {pending ? "Sending…" : "Submit for review"}
      </button>
    </form>
  );
}
