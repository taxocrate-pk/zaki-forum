"use client";
import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mx-auto mt-10 max-w-sm space-y-3">
      <h1 className="text-xl font-bold">Admin login</h1>
      <input type="password" name="password" required className="w-full rounded-lg border border-stone-300 px-3 py-2" placeholder="Password" />
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-emerald-900 py-2 font-semibold text-white">Log in</button>
    </form>
  );
}
