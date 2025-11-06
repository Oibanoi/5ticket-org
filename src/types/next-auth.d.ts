import "next-auth/jwt";

import { DefaultSession } from "next-auth";

import { Data } from "./data";

/**
 * NextAuth Type Extensions
 * Mở rộng các interface mặc định của NextAuth để support custom fields
 */
declare module "next-auth" {
  /**
   * User interface - Extend Data.User với NextAuth-specific fields
   * Được return từ authorize() function và sử dụng trong callbacks
   */
  interface User extends Data.User {
    /** Environment tracking (dev/prod) */
    env?: "dev" | "prod";
  }

  /**
   * Session interface - Cấu trúc session object
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   *
   * Usage:
   * ```ts
   * const { data: session } = useSession();
   * session.user.name // ✅ string
   * session.access_token // ✅ string | undefined
   * ```
   */
  interface Session {
    /** User data - combine Data.User với DefaultSession user fields */
    user: Data.User & DefaultSession["user"];

    /** JWT access token để gọi backend APIs */
    access_token?: string;

    /** Environment tracking */
    env?: "dev" | "prod";
  }
}

/**
 * NextAuth JWT Type Extensions
 * Mở rộng JWT token để chứa custom data
 */
declare module "next-auth/jwt" {
  /**
   * JWT interface - Cấu trúc JWT token được encode và lưu trong cookie
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    /** OpenID ID Token (cho OAuth providers như Google) */
    idToken?: string;

    /** Backend API access token */
    access_token?: string;

    /** Environment tracking */
    env?: "dev" | "prod";
  }
}
