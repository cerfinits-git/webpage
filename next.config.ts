import type { NextConfig } from "next";

// Permanent redirects from the old static-site .html URLs (indexed by Google)
// to the new clean routes. Keep every old URL alive forever.
const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  { source: "/index.html", destination: "/" },
  { source: "/blog/index.html", destination: "/blog" },
  { source: "/blog/cot-gold-basics.html", destination: "/blog/cot-gold-basics" },
  { source: "/blog/trading-psychology-discipline.html", destination: "/blog/trading-psychology-discipline" },
  { source: "/blog/ict-market-maker-basics.html", destination: "/blog/ict-market-maker-basics" },
  { source: "/algo.html", destination: "/algo" },
  // gold-start book (M9 routes)
  { source: "/gold-start-index.html", destination: "/gold-start" },
  { source: "/gold-start-full.html", destination: "/gold-start/full" },
  { source: "/gold-start-cheatsheet.html", destination: "/gold-start/cheatsheet" },
  { source: "/gold-start-glossary.html", destination: "/gold-start/glossary" },
  { source: "/gold-start-ch01.html", destination: "/gold-start/ch01" },
  { source: "/gold-start-ch02.html", destination: "/gold-start/ch02" },
  { source: "/gold-start-ch03.html", destination: "/gold-start/ch03" },
  { source: "/gold-start-ch04.html", destination: "/gold-start/ch04" },
  { source: "/gold-start-ch05.html", destination: "/gold-start/ch05" },
  { source: "/gold-start-ch06.html", destination: "/gold-start/ch06" },
  { source: "/gold-start-ch07.html", destination: "/gold-start/ch07" },
  { source: "/gold-start-ch08.html", destination: "/gold-start/ch08" },
  { source: "/gold-start-ch09.html", destination: "/gold-start/ch09" },
  { source: "/gold-start-ch10.html", destination: "/gold-start/ch10" },
  // NOTE: the legacy uppercase /GOLD-START-Cerfinits.pdf redirect lives in
  // middleware.ts — Next redirects match case-insensitively, so a rule here
  // would also match its own lowercase destination and loop forever.
];

const nextConfig: NextConfig = {
  // The development-tools portal sits above fixed app navigation and can
  // intercept mobile taps. Keep localhost previews behaviorally faithful to
  // production; build and runtime diagnostics remain available in the console.
  devIndicators: false,
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
