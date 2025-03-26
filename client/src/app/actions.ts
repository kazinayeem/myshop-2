"use server";

import { cookies } from "next/headers";

export async function create(data: {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}) {
  const cookieStore = await cookies();

  cookieStore.set("token", data.token, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    priority: "high",
  });
  cookieStore.set("user", JSON.stringify(data.user), {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    priority: "high",
  });
}

// get cookie
export async function get() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = cookieStore.get("user")?.value;
  return { token, user };
}

// delete cookie
export async function remove() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");
}
