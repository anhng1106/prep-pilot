"use client";

import { getPageTitle } from "@/helpers/pageTitles";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Breadcrumb = { name: string; path: string };

const usePageTitle = () => {
  const pathname = usePathname();

  const { title, breadcrumbs } = useMemo(() => {
    const { title, breadcrumb } = getPageTitle(pathname);

    return {
      title,
      breadcrumbs: (breadcrumb?.length
        ? breadcrumb
        : [{ name: "Home", path: "/" }]) as Breadcrumb[],
    };
  }, [pathname]);

  return { title, breadcrumbs };
};

export default usePageTitle;
