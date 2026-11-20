"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { savePost, getPost, newId, CATEGORIES } from "@/lib/store";
import { isAdmin, passwordOk, setAdminCookie, clearAdminCookie } from "@/lib/auth";

const clip = (v, n) => String(v ?? "").trim().slice(0, n);

function cleanUrl(v) {
  const s = clip(v, 300);
  if (!s) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : "https://" + s);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

export async function submitPost(prev, formData) {
  // spam traps: hidden field + too-fast submit
  if (clip(formData.get("company"), 100)) return { ok: true };
  const started = Number(formData.get("t") || 0);
  if (!started || Date.now() - started < 4000) {
    return { error: "Please take a moment and submit again." };
  }

  const post = {
    id: newId(),
    category: clip(formData.get("category"), 20),
    title: clip(formData.get("title"), 120),
    url: cleanUrl(formData.get("url")),
    price: clip(formData.get("price"), 40),
    da: clip(formData.get("da"), 20),
    traffic: clip(formData.get("traffic"), 40),
    niche: clip(formData.get("niche"), 80),
    body: clip(formData.get("body"), 3000),
    name: clip(formData.get("name"), 60),
    contact: clip(formData.get("contact"), 120),
    status: "pending",
    featured: false,
    createdAt: Date.now(),
  };

  if (!CATEGORIES[post.category]) return { error: "Choose a section." };
  if (post.title.length < 8) return { error: "Title is too short." };
  if (post.body.length < 30) return { error: "Please write at least a few lines." };
  if (!post.contact) return { error: "Add an email or WhatsApp so people can reach you." };
  if ((post.body.match(/https?:\/\//g) || []).length > 3) {
    return { error: "Too many links in the description." };
  }

  await savePost(post);
  return { ok: true };
}

export async function login(prev, formData) {
  if (!passwordOk(formData.get("password"))) return { error: "Wrong password." };
  await setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/");
}

export async function moderate(formData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const post = await getPost(String(formData.get("id") || ""));
  if (!post) return;
  const op = formData.get("op");
  if (op === "approve") post.status = "approved";
  else if (op === "reject") post.status = "rejected";
  else if (op === "pending") post.status = "pending";
  else if (op === "star") post.featured = !post.featured;
  else return;
  await savePost(post);
  revalidatePath("/", "layout");
}
