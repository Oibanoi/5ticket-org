import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getMeSummary, login } from "features/auth/services";

function getEnv(
  credentials: Record<"email" | "password" | "isDevelopment", string> | undefined,
  req: { headers?: Record<string, string> }
) {
  return credentials?.isDevelopment == "true"
    ? "dev"
    : req.headers?.["data-env"] == "dev"
      ? "dev"
      : "prod";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        savePassword: { label: "Save Password", type: "checkbox" },
        isDevelopment: { label: "Is Development", type: "checkbox" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email và mật khẩu là bắt buộc");
        }
        const env = getEnv(credentials, req);
        try {
          const { data, success, message } = await login(credentials!, { timeout: 6000 });
          if (!success || !data?.access_token) throw new Error(message || "Login failed");

          const { data: profile, success: ok } = await getMeSummary({
            headers: { Authorization: `Bearer ${data.access_token}` },
          });
          if (!ok || !profile) throw new Error("User fetch failed");

          return {
            id: String(profile.id),
            name: profile.name,
            email: profile.email,
            avatar: profile.avatar,
            access_token: data.access_token,
            env,
          };
        } catch (error: any) {
          
          if (error.code === "ECONNABORTED") {
            throw new Error("Timeout: Không thể kết nối đến máy chủ");
          }
          
          if (error.response?.status === 401) {
            throw new Error("Username/ mật khẩu sai vui lòng kiểm tra lại");
          }

          throw new Error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        avatar: token.avatar as string,
      };
      session.access_token = token.access_token;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

