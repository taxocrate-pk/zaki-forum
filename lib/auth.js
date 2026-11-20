import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

const COOKIE = "zf_admin";

function token() {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return null;
  return createHash("sha256").update("gpk:" + pw).digest("hex");
}

export function passwordOk(input) {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw || typeof input !== "string") return false;
  const a = Buffer.from(createHash("sha256").update(input).digest("hex"));
  const b = Buffer.from(createHash("sha256").update(pw).digest("hex"));
  return timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const t = token();
  if (!t) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return !!c && c.length === t.length && timingSafeEqual(Buffer.from(c), Buffer.from(t));
}
