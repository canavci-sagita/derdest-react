"use client";

import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useTranslation } from "@/stores/TranslationContext";

const Breadcrumb = () => {
  const { t } = useTranslation();

  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  const mainItemClasses =
    "relative ml-5 pl-0.5 before:content-[''] before:w-[14px] before:h-[14px] before:bg-chevron-black before:transform before:rotate-[-90deg] before:bg-[length:100%] before:-ml-[1.125rem] before:absolute before:my-auto before:inset-y-0 dark:before:bg-chevron-black";
  const currentItemClasses = "text-slate-600 cursor-text dark:text-slate-400";

  /* SSR Fix */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  /********** */

  return (
    <nav className="flex-1 hidden xl:block">
      <ol className="flex items-center text-theme-1 dark:text-slate-300">
        <li>Derdest</li>
        {pathNames.length === 0 && (
          <li className={clsx([mainItemClasses, currentItemClasses])}>
            <Link href="/">{t("dashboard")}</Link>
          </li>
        )}
        {pathNames.map((link, idx) => {
          const href = `/${pathNames.slice(0, idx + 1).join("/")}`;
          link = link.replace(/-(\w)/g, (_, char) => char.toUpperCase());

          return (
            <li
              key={idx}
              className={clsx([
                mainItemClasses,
                {
                  currentItemClasses: paths === href,
                },
              ])}
            >
              <Link href={href}>{t(link)}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
