import Link from "next/link";
import React from "react";
import type { UrlObject } from "url";

type Props = {
  pages: {
    title: string;
    href: string | UrlObject;
    onClick?(e: React.MouseEvent<HTMLAnchorElement>): void;
  }[];
};

const Breadcrumbs = ({ pages }: Props) => {
  return (
    <div className="breadcrumbs text-xs py-0 mt-6 mb-2 text-gray-600 leading-5">
      <ul className="flex flex-wrap">
        {pages.map((page, index) => (
          <li key={index}>
            <Link
              href={page.href}
              className={index + 1 === pages.length ? "font-semibold" : undefined}
              onClick={page.onClick}
            >
              {page.title}
            </Link>
            {index + 1 !== pages.length && (
              <span aria-hidden="true" className="mx-2 text-gray-400">
                &gt;
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
