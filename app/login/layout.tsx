import type { Metadata } from "next";

// The page itself is a client component and cannot export metadata, so it lives
// here. A sign-in form has nothing to offer a search result, hence noindex —
// but it still gets a canonical so the ?callbackUrl variants do not read as
// separate pages.
export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | Cerfinits",
  description: "เข้าสู่ระบบเพื่อใช้งาน Cerfinits Journal และเนื้อหาสำหรับสมาชิก",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
