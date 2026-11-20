import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | Guest Post Sites, Buyers & Writers`, template: `%s | ${SITE.name}` },
  description:
    "Free forum to list guest post sites, find blogs that accept guest posts, and hire content writers. Every listing is checked before it goes live.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
        <header className="bg-emerald-900 text-white">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight">
              {SITE.name}<span className="text-amber-300">{SITE.tld}</span>
            </Link>
            <Link
              href="/new"
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-amber-200"
            >
              + Post free
            </Link>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-stone-200 text-sm text-stone-500">
          <div className="mx-auto max-w-5xl px-4 py-6 flex flex-wrap gap-x-6 gap-y-2 justify-between">
            <span>© 2026 {SITE.name}. Listings are posted by users; check every site before you pay.</span>
            <span>
              ★ = checked by {SITE.name}
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
