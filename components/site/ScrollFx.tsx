"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll-reveal with per-group stagger — ported 1:1 from the static site's
// inline script. Re-runs on route change so every (site) page gets it.
export default function ScrollFx() {
  const path = usePathname();

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal, .reveal-scale");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => {
      const parent = el.parentElement;
      if (!el.dataset.staggered && parent) {
        const siblings = Array.from(parent.children).filter(
          (c) => c.classList.contains("reveal") || c.classList.contains("reveal-scale"),
        );
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.min(idx, 6) * 90}ms`;
        el.dataset.staggered = "1";
      }
      io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);

  return null;
}
