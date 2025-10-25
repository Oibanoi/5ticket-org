import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "styles/globals.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { NavigationProvider } from "shared/providers/navigation";
import { Logo } from "shared/components/icon/logo";
import { Header } from "shared/components/header";
import { Navigation } from "shared/components/navigation";
import LayoutHeader from "shared/components/layout-header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QueryProvider from "shared/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const modeScript = `
  let darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)'),
    lightSchemeIcon = document.querySelector('link#light-scheme-icon');
    darkSchemeIcon = document.querySelector('link#dark-scheme-icon');

  updateMode()
  darkModeMediaQuery.addEventListener('change', updateModeWithoutTransitions)
  window.addEventListener('storage', updateModeWithoutTransitions)

  function toggleMode() {
    disableTransitionsTemporarily();

    let darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let isSystemDarkMode = darkModeMediaQuery.matches;
    let isDarkMode = document.documentElement.classList.toggle("dark");
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode;
    } else {
      window.localStorage.isDarkMode = isDarkMode;
    }
  }
  function updateMode() {
    let isSystemDarkMode = darkModeMediaQuery.matches
    let isDarkMode = window.localStorage.isDarkMode === 'true' || (!('isDarkMode' in window.localStorage) && isSystemDarkMode)

    if (isDarkMode) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.dataset.theme = "light";
    }

    if (isDarkMode === isSystemDarkMode) {
      delete window.localStorage.isDarkMode
    }
    if (isSystemDarkMode) {
      lightSchemeIcon.remove();
      document.head.append(darkSchemeIcon);
    } else {
      document.head.append(lightSchemeIcon);
      darkSchemeIcon.remove();
    }
  }
  window.__theme={toggle:toggleMode}

  function disableTransitionsTemporarily() {
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  function updateModeWithoutTransitions() {
    disableTransitionsTemporarily()
    updateMode()
  }
`;
export const metadata: Metadata = {
  title: "5Ticket ORG",
  description: "Quản lý 5ticket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-transparent" data-theme="light">
      <head>
        <link id="light-scheme-icon" rel="icon" href="/icon-dark.svg" sizes="any" />
        <link id="dark-scheme-icon" rel="icon" href="/icon.svg" sizes="any" />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <NavigationProvider>
            <style precedence="default" href="__layout-inline-styles">
              {/* {`
              body {
              }
              .dark body {
                background-color: rgb(2 34 91);
              }
            `} */}
            </style>

            <div className="lg:ml-72 xl:ml-80">
              <LayoutHeader />

              <div className={"relative pt-14 min-h-screen"}>
                {/* {!tenant.selected && !skip ? (
            <div className="py-6">
              <div className="text-center">
                <Logo height={40} className="fill-secondary-600 inline-block" />
                <p className="text-center">Select an organization</p>
              </div>
              {tenantApprove ? (
                <div className="mt-4">
                  <div
                    data-test="tenant-selectors"
                    className="text-center mt-3 xl:mt-10 space-y-3"
                  >
                    {tenantApprove.map((item) => {
                      return (
                        <Button
                          key={"tenant_" + item.id}
                          className="block w-full xl:w-1/3 py-3 px-3 rounded-xl mx-auto h-auto"
                          onClick={() => tenant.set(item)}
                        >
                          <p className="font-bold">{item.name}</p>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : roles.isLoading ? (
            <div className="fixed inset-0 flex items-center justify-center flex-col">
              <Logo height={40} className="fill-secondary-600" />
              <p className="mt-3 fontb">Đang tải</p>
            </div>
          ) : ( */}
                <div className="rounded-tl-4xl px-4 sm:px-6 lg:px-8 bg-gray-100 py-2">
                  {children}
                </div>
                {/* )} */}
              </div>
            </div>
          </NavigationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
