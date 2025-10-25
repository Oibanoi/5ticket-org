"use client";
import Link from "next/link";
import { forwardRef, JSX, useEffect, useState } from "react";
import useBoolean from "../hooks/useBoolean";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Routers } from "./router";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Logo } from "./icon/logo";
import Svg from "./icon/svg";
import { ModeToggle } from "./mode-toggle";
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
  // const { data } = useSession();
  // const user = data!.user;

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
        <div
          className="hidden min-[416px]:contents relative tenant hover:tenant-droplist"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-x-3 text-zinc-600 dark:text-zinc-400 cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-bold leading-5 truncate">
                {/* {user.name} */}
                Haha
              </p>
              <p className="text-xs leading-3">
                {/* {getRoleName(user.role.name)} */}
                Role
              </p>
            </div>
            <div className="w-8">
              <div className="block-image block-square  rounded-full overflow-hidden bg-secondary-900">
                <img
                  className="w-full h-full object-cover rounded"
                  src={
                    "https://imagedelivery.net/5ejkUOtsMH5sf63fw6q33Q/1a091d0e-3d38-4da3-063a-4833e08cf500/thumbnail"
                  }
                  // alt={user.name || user.email}
                />
              </div>
            </div>
            <div className="py-5" />
            <div></div>
          </div>
          {/* Droplist */}
          {infoCompany !== undefined && (
            <div
              className={clsx(
                "tenant-droplist absolute right-10 top-10 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 font-semibold",
                isDroplistVisible ? "block" : "hidden"
              )}
            >
              <p
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 space-x-2 flex"
                // onClick={() => ModalUpdateTenant.open()}
              >
                <Svg src="/icons/akar-icons_info.svg" width={24} height={24} />
                <span>Thông tin người bán</span>
              </p>
              <p
                className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 flex space-x-2"
                onClick={logout}
              >
                <Svg src="/icons/ic_outline-logout.svg" width={24} height={24} />
                <span>Đăng xuất</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});
