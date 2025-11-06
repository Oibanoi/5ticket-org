import axios from "axios";
import { cache } from "react";
import { env } from "../env";
import { handleApiError } from "./error-handler";
import logger from "../logger";

/**
 * Axios instance for SERVER-SIDE requests
 * Use in Server Components, API Routes, Server Actions, and Static Generation
 *
 * Features:
 * - Automatic session token injection from server session
 * - React cache() for deduplication within same request
 * - No auto sign-out (let the component/route handle it)
 * - Works in static generation (no session available)
 *
 * IMPORTANT: Uses lazy imports to avoid bundling server-only code in client
 */
const serverAxios = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Cached session getter - deduplicates getServerSession calls
 * Uses React cache() to ensure only 1 session fetch per request
 *
 * Note: Returns null during static generation (no session available)
 */
const getCachedServerSession = cache(async () => {
  if (typeof window !== "undefined") return null;

  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("lib/auth");
    return await getServerSession(authOptions);
  } catch (error) {
    // During static generation, session might not be available
    logger.debug("[Server] Session not available (likely static generation)");
    return null;
  }
});

serverAxios.interceptors.request.use(
  async (config) => {
    // @ts-expect-error: Add metadata property for request timing
    config.metadata = { startTime: new Date() };

    if (typeof window === "undefined") {
      const session = await getCachedServerSession();

      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }

      logger.debug(`[Server] API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        hasAuth: !!session?.access_token,
        context: session ? "authenticated" : "public",
      });
    }

    return config;
  },
  (error) => {
    logger.error("[Server] API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
serverAxios.interceptors.response.use(
  (response) => {
    type ConfigWithMetadata = typeof response.config & { metadata?: { startTime: Date } };
    const duration =
      new Date().getTime() -
      ((response.config as ConfigWithMetadata).metadata?.startTime?.getTime() || 0);

    logger.debug(
      `[Server] API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        duration: `${duration}ms`,
      }
    );

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const config = error.config;

    logger.error(`[Server] API Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
      status,
      message: error.response?.data?.message || error.message,
    });

    // Server-side doesn't auto sign-out
    // Let the component/route handle 401 errors appropriately
    // (e.g., redirect to login, show error message, etc.)

    handleApiError(error);
    return Promise.reject(error);
  }
);

export default serverAxios;
