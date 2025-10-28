"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "../icon/logo";
import { Header } from "./header";
import { Navigation } from "./navigation";

const LayoutHeader = () => {
  return (
    <motion.header
      layoutScroll
      className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex scrollbar-dark"
    >
      <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto  lg:px-6 lg:pb-8 lg:pt-4  xl:w-80 dark:bg-dark">
        <div className="hidden lg:flex">
          <Link aria-label="Home" href="/" className="flex items-end">
            <Logo height={40} className="fill-black dark:fill-light" />
          </Link>
        </div>
        <Header />
        <Navigation className="hidden lg:mt-10 lg:block" />
      </div>
    </motion.header>
  );
};

export default LayoutHeader;
