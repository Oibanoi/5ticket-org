"use client";
import Link from "next/link";
import { forwardRef, JSX, useEffect, useState } from "react";
import useBoolean from "../../hooks/useBoolean";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Routers } from "../router";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Logo } from "../icon/logo";
import Svg from "../icon/svg";
import { ModeToggle } from "../ui/mode-toggle";
import "styles/globals.css";
function TopLevelNavItem({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget;
}) {
  return (
    <li>
      <Link
        href={href}
        target={target}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

// function getRoleName(role: UserRole) {
//   switch (role) {
//     case UserRole.User:
//       return "Người dùng";
//     default:
//       return "Quản trị viên";
//   }
// }
export const Header = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(function Header(
  { className },
  ref
) {
  // let { isOpen: mobileNavIsOpen, close } = useMobileNavigationStore();
  // let isInsideMobileNavigation = useIsInsideMobileNavigation();
  const isInsideMobileNavigation = false;
  const [isDroplistVisible, setIsDroplistVisible] = useState(false);
  const isLoading = useBoolean();
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  // const tenant = useTenantStore((s) => s.selected);
  const [infoCompany, setInfoCompany] = useState<{
    address: string;
    companyCode: string;
    companyName: string;
    companyTax: string;
    email: string;
    name: string;
    numberParticipate: string;
    phone: string;
    prevEvent: string;
  }>();

  // useEffect(() => {
  //   if (!isInsideMobileNavigation) {
  //     close();
  //   }
  // }, [close, isInsideMobileNavigation, router.asPath]);

  // useEffect(() => {
  //   if (tenant?.metadata)
  //     setInfoCompany(JSON.parse(tenant?.metadata as string));
  // }, [tenant]);

  const handleMouseEnter = () => {
    setIsDroplistVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDroplistVisible(false);
  };

  // const queryClient = useQueryClient();
  const logout = async () => {
    try {
      isLoading.setTrue();
      await signOut({ callbackUrl: Routers.LOGIN }).finally(isLoading.setFalse);
    } catch (error) {
    } finally {
      // queryClient.clear();
      isLoading.setFalse();
    }
  };

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8 backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80 bg-white dark:bg-dark "
      ref={ref}
    >
      {/* <ModalUpdateTenant /> */}
      {/* <Search /> */}
      <div className="hidden lg:block lg:max-w-md lg:flex-auto"></div>
      <div className="flex items-center gap-5 lg:hidden">
        {/* <MobileNavigation /> */}
        <Link href="/" aria-label="Home">
          <Logo className="h-6 fill-black dark:fill-white" />
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <nav className={true ? "hidden md:block" : "hidden"}>
          <ul role="list" className="flex items-center gap-8">
            <TopLevelNavItem target="_blank" href="https://dapi.5bib.com/swagger-ui/index.html#/">
              API
            </TopLevelNavItem>
            <TopLevelNavItem href="/admin/documentation">Documentation</TopLevelNavItem>
          </ul>
        </nav>
        <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
        <div className="flex gap-4">
          <ModeToggle />
        </div>
        {status === "authenticated" && user ? (
          <div
            className="hidden min-[416px]:contents relative tenant hover:tenant-droplist"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center gap-x-3 text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold leading-5 truncate max-w-32">
                  {user.name || user.email || "User"}
                </p>
                <p className="text-xs leading-3 capitalize">
                  {(user as any).role?.name?.replace("ROLE_", "").replace("_", " ").toLowerCase() || "User"}
                </p>
              </div>
              <div className="w-8">
                <div className="block-image block-square rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {user.image ? (
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={user.image}
                      alt={user.name || user.email || "User"}
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Droplist */}
            <div
              className={clsx(
                "tenant-droplist absolute right-0 top-12 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-2 border border-gray-200 dark:border-gray-700 z-50",
                isDroplistVisible ? "block" : "hidden"
              )}
            >
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.name || "Người dùng"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 capitalize">
                  {(user as any).role?.name?.replace("ROLE_", "").replace("_", " ").toLowerCase() || "User"}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  onClick={() => router.push("/profile")}
                >
                  <Svg src="/icons/akar-icons_info.svg" width={16} height={16} />
                  <span>Thông tin cá nhân</span>
                </button>
                
                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  onClick={() => router.push("/settings")}
                >
                  <Svg src="/icons/settings.svg" width={16} height={16} />
                  <span>Cài đặt</span>
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                
                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3"
                  onClick={logout}
                  disabled={isLoading.value}
                >
                  <Svg src="/icons/ic_outline-logout.svg" width={16} height={16} />
                  <span>{isLoading.value ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Show login button when not authenticated
          <div className="flex items-center">
            <Link
              href={Routers.LOGIN}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
});
