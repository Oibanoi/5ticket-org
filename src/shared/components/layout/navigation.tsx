"use client";

import { Button, Tag } from "antd";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JSX, PropsWithChildren, useRef } from "react";
import { useNavigationStore } from "../../providers/navigation";
import useBoolean from "../../hooks/useBoolean";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { Routers } from "../router";

type Permission = number;
export interface NavigationItemType {
  title: string;
  href: string;
  tag?: string;
  icon?: React.ReactNode;
  onClick?(): void;
  params?: boolean;
  matchPath?: boolean | string | ((pathname: string) => boolean);
  show?: boolean | string | ((pathname: string) => boolean);
  isExact?: boolean;
  hideSubOnMatch?: boolean;
  permission?: Permission;
}

export interface NavigationGroupType {
  title: string;
  links: (NavigationItemType & { links?: Array<NavigationItemType> })[];
}

function useInitialValue<T>(value: T, condition = true): T {
  const initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function TopLevelNavItem({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}

function NavLink({
  icon,
  href,
  tag,
  active,
  isAnchorLink = false,
  children,
  onClick,
}: PropsWithChildren<{
  icon?: React.ReactNode;
  href: string;
  tag?: string;
  active?: boolean;
  isAnchorLink?: boolean;
  onClick?(): void;
}>) {
  const className = clsx(
    "flex gap-2 py-1 pr-3 text-sm transition items-center",
    isAnchorLink ? "pl-7" : "pl-4",
    active
      ? "text-zinc-900 dark:text-white font-bold"
      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
  );
  const Child = (
    <>
      {icon && <span className="w-4 h-4">{icon}</span>}
      <span className="line-clamp-1 flex-1">{children}</span>
      {tag && <Tag color="zinc">{tag}</Tag>}
    </>
  );
  return onClick ? (
    <button onClick={onClick} aria-current={active ? "page" : undefined} className={className}>
      {Child}
    </button>
  ) : href ? (
    <Link href={href} aria-current={active ? "page" : undefined} className={className}>
      {Child}
    </Link>
  ) : null;
}

function isMatchRoute(link: NavigationItemType, pathname: string, asPath?: string) {
  return pathname === "/"
    ? pathname === link.href
    : link.isExact
    ? pathname === link.href || asPath === link.href
    : pathname.startsWith(link.href);
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavigationGroupType;
  className?: string | boolean;
}) {
  //   const isInsideMobileNavigation = useIsInsideMobileNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const asPath = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;

  // Extract ID from pathname for dynamic routes
  const pathSegments = pathname.split("/");
  const currentId = pathSegments[2]; // /events/[id] -> pathSegments[2] is the id
  //   const [sections] = useInitialValue(
  //     [useSectionStore((s) => s.sections)],
  //     isInsideMobileNavigation
  //   );

  const activeChildrenIndex = group.links.findIndex((link) =>
    pathname === "/" || link.href === "/"
      ? pathname === link.href
      : pathname.startsWith(link.href) || asPath === link.href
  );
  const isActiveGroup = activeChildrenIndex !== -1;

  return (
    <li className={clsx("relative mt-6", className)}>
      <motion.h2 layout="position" className="text-xs font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence>
          {isActiveGroup && (
            <motion.div
              layout
              className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/20"
            />
          )}
        </AnimatePresence>
        <ul role="list" data-test="side-navigation" className="border-l border-transparent">
          {group.links.map((link, index) => {
            const isMatchedRoot = isMatchRoute(link, pathname, asPath);
            return (
              <motion.li key={link.href} layout="position" className="relative">
                <NavLink
                  icon={link.icon}
                  href={link.href}
                  tag={link.tag}
                  active={isMatchedRoot}
                  onClick={link.onClick}
                >
                  {link.title}
                </NavLink>
                {/* Sublinks */}
                {(() => {
                  // For sublinks, ignore isExact and use startsWith logic
                  // But exclude /events/create route
                  const isSublinksMatch =
                    link.links &&
                    pathname.startsWith(link.href) &&
                    !pathname.startsWith("/events/create");
                  return isSublinksMatch;
                })() && (
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.ul
                      key="sublinks"
                      role="list"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { delay: 0.1 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15 },
                      }}
                      className="relative"
                    >
                      {link.links?.map((sublink, index) => {
                        const shouldShow =
                          typeof sublink.show === "undefined"
                            ? true
                            : typeof sublink.show === "boolean"
                            ? sublink.show
                            : typeof sublink.show === "string"
                            ? sublink.show === pathname
                            : sublink.show(pathname);

                        return shouldShow ? (
                          <motion.li
                            key={sublink.href || index}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              transition: { delay: 0.1 },
                            }}
                            exit={{
                              opacity: 0,
                              transition: { duration: 0.15 },
                            }}
                          >
                            {(() => {
                              const resolvedHref =
                                sublink.params && currentId
                                  ? sublink.href?.replace("[id]", currentId)
                                  : sublink.href;

                              // Skip rendering if href still contains [id] and params is true
                              if (sublink.params && resolvedHref?.includes("[id]")) {
                                return null;
                              }

                              return (
                                <NavLink
                                  icon={sublink.icon}
                                  href={resolvedHref}
                                  onClick={sublink.onClick}
                                  tag={sublink.tag}
                                  active={pathname.startsWith(sublink.href)}
                                  isAnchorLink
                                >
                                  {sublink.title}
                                </NavLink>
                              );
                            })()}
                          </motion.li>
                        ) : null;
                      })}
                    </motion.ul>
                  </AnimatePresence>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export function Navigation(props: JSX.IntrinsicElements["nav"]) {
  const navigations = useNavigationStore((s) => s.navigations);
  const isLoading = useBoolean();
  //   const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async () => {
    try {
      isLoading.setTrue();
      await signOut({ callbackUrl: Routers.LOGIN });
    } finally {
      //   queryClient.clear();
      isLoading.setFalse();
    }
  };

  return (
    <nav {...props}>
      <ul role="list">
        {/* {configs.IS_DEVELOPMENT && (
          <>
            <TopLevelNavItem href="#">API</TopLevelNavItem>
            <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
            <TopLevelNavItem href="#">Support</TopLevelNavItem>
          </>
        )} */}
        {navigations.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 && "md:mt-0"}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6">
          <Button disabled={isLoading.value} className="w-full" onClick={logout}>
            Đăng xuất
          </Button>
        </li>
      </ul>
    </nav>
  );
}
