import { authOptions } from "lib/auth";
import { getServerSession } from "next-auth/next";

/**
 * Lấy session hiện tại (Server-side)
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Lấy thông tin user hiện tại
 * Sử dụng trong Server Components
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return { accesToken: session?.access_token!, user: session?.user };
}