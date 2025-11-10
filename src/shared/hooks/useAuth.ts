import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useCallback } from "react";
import { Routers } from "shared/components/router";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user ?? null;
  const accessToken = session?.access_token ?? null;
  
  const signOut = useCallback(async (callbackUrl: string = Routers.LOGIN) => {
    await nextAuthSignOut({ callbackUrl, redirect: true });
  }, []);
  
  return {
    isLoading,
    isAuthenticated,
    user,
    session,
    accessToken,
    signOut,
  };
}

