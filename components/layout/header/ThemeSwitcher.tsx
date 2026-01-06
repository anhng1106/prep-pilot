"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "light" ? (
        <Icon
          icon="il:brightness"
          fontSize={22}
          width="24"
          height="24"
          onClick={() => setTheme("dark")}
        />
      ) : (
        <Icon
          icon="il:moon"
          width="24"
          height="24"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
}
