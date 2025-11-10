import { motion } from "framer-motion";
import Link from "next/link";
import { forwardRef, JSX, useState } from "react";
import "styles/globals.css";
import { UserMenu } from "../auth/UserMenu";
import { Logo } from "../icon/logo";
import { Routers } from "../router";
import { ModeToggle } from "../ui/mode-toggle";
import { useAuth } from "shared/hooks/useAuth";
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

  const {isAuthenticated } = useAuth();


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
        {isAuthenticated ? (
          <UserMenu />
        ) : (
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
