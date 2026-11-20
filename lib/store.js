import "server-only";
import { put, get, list } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_DIR = path.join(process.cwd(), ".data");

export const CATEGORIES = {
  offer: { label: "Guest Post Sites", hint: "Your site accepts guest posts" },
  wanted: { label: "Wanted", hint: "You need guest posts / links" },
  writers: { label: "Writers", hint: "You write content for others" },
  tips: { label: "Tips & Talk", hint: "Advice, questions, discussion" },
};

const key = (id) => `posts/${id}.json`;

export async function savePost(post) {
  const body = JSON.stringify(post);
  if (useBlob) {
    await put(key(post.id), body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } else {
    await fs.mkdir(path.join(LOCAL_DIR, "posts"), { recursive: true });
    await fs.writeFile(path.join(LOCAL_DIR, key(post.id)), body);
  }
}

export async function getPost(id) {
  if (!/^[a-z0-9]{6,24}$/.test(id)) return null;
  try {
    if (useBlob) {
      const res = await get(key(id), { access: "private", useCache: false });
      if (!res) return null;
      return JSON.parse(await new Response(res.stream).text());
    }
    return JSON.parse(await fs.readFile(path.join(LOCAL_DIR, key(id)), "utf8"));
  } catch {
    return null;
  }
}

export async function listPosts() {
  let ids = [];
  if (useBlob) {
    let cursor;
    do {
      const r = await list({ prefix: "posts/", cursor, limit: 1000 });
      ids.push(...r.blobs.map((b) => b.pathname.slice(6, -5)));
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
  } else {
    try {
      ids = (await fs.readdir(path.join(LOCAL_DIR, "posts"))).map((f) => f.slice(0, -5));
    } catch {
      ids = [];
    }
  }
  const posts = (await Promise.all(ids.map(getPost))).filter(Boolean);
  return posts.sort((a, b) => b.createdAt - a.createdAt);
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
