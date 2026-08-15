import Link from "next/link";

// Blog header/footer — ported from blog/*.html (Thai-only, no lang toggle).
export function BlogHeader({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand">
          <span className="dot" /> Cerfinits
        </Link>
        <nav className="nav-links">
          <Link href="/#about">เกี่ยวกับ</Link>
          <Link href="/blog">บทความ</Link>
          <Link href="/#ebook">E-book ฟรี</Link>
          <Link href="/#products">สินค้า</Link>
          <Link href="/#algo">Algo</Link>
          <Link href="/#community">คอมมูนิตี้</Link>
          <Link href="/#testimonials">รีวิว</Link>
          <Link href="/#faq">FAQ</Link>
          <Link href="/#follow">ติดตาม</Link>
        </nav>
        {isLoggedIn && (
          <Link href="/plan/portfolio" className="btn nav-cta" style={{ background: "var(--ink)", color: "var(--bg)" }}>พอร์ตลงทุน</Link>
        )}
      </div>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-inner">
          <Link href="/" className="brand">
            <span className="dot" /> Cerfinits
          </Link>
          <div className="links">
            <Link href="/blog">บทความ</Link>
            <Link href="/#products">สินค้า</Link>
            <Link href="/#algo">Algo</Link>
            <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">Discord</a>
          </div>
        </div>
        <div className="copyright">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Cerfinits. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
