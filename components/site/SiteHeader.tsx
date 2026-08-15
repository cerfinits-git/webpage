"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { T, useLang } from "./LangContext";
import { useTheme } from "./ThemeContext";
import LogoMark from "@/components/LogoMark";
import { logout } from "@/lib/actions/auth";

export interface HeaderUser {
  username?: string;
  name?: string;
  email?: string;
  picture?: string | null;
  isPremium?: boolean;
}

export default function SiteHeader({
  isLoggedIn = false,
  journalEnabled = false,
  user: initialUser,
}: {
  isLoggedIn?: boolean;
  journalEnabled?: boolean;
  user?: HeaderUser | null;
}) {
  const { lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null | undefined>(initialUser);
  const accountRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Fetch client-side profile if logged in and profile details or picture is missing
  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.isLoggedIn && data.user) {
            setUser((prev) => ({
              ...prev,
              ...data.user,
            }));
          }
        })
        .catch(() => {});
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  // Sync if initialUser changes from server
  useEffect(() => {
    if (initialUser) {
      setUser((prev) => ({
        ...prev,
        ...initialUser,
      }));
    }
  }, [initialUser]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
    setLoginOpen(false);
  }, [pathname]);

  // Listen to 'open-login' custom events from any page / button to open the small Google login tab
  useEffect(() => {
    const handleOpenLogin = () => {
      setLoginOpen(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("open-login", handleOpenLogin);
    return () => window.removeEventListener("open-login", handleOpenLogin);
  }, []);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    if (!accountOpen && !loginOpen) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountOpen && accountRef.current && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
      if (loginOpen && loginRef.current && !loginRef.current.contains(target)) {
        setLoginOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setLoginOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen, loginOpen]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("mm-open");
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("mm-open");
    };
  }, [menuOpen]);

  const themeIcon = theme === "dark" ? (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    window.open(
      "/api/auth/google",
      "google_login_popup",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
    );
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(scrollY > 20);

      const currentPath = window.location.pathname;
      if (currentPath === "/") {
        const sections = ["about", "testimonials", "faq", "follow"];
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollY >= el.offsetTop - 200) {
            current = id;
          }
        }
        setActiveHash(current);
      } else if (currentPath === "/products") {
        const sections = ["ebook", "products", "algo"];
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollY >= el.offsetTop - 200) {
            current = id;
          }
        }
        setActiveHash(current);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = user?.name || user?.username || (lang === "en" ? "Cerfinits Trader" : "สมาชิก Cerfinits");
  const displayEmail = user?.email || (user?.username?.includes("@") ? user.username : `@${user?.username || "cerfinits"}`);
  const initialLetter = displayName.charAt(0).toUpperCase() || "C";

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap nav-inner">
          <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
            <Link href="/#top" className="brand">
              <LogoMark /> <span>Cerfinits</span>
            </Link>
          </div>
          <nav className="nav-links">
            <div className="about-group">
              <Link href="/" className={`about-main ${isHome ? "active" : ""}`}>
                <T th="หน้าแรก" en="Home" />
              </Link>
              <div className="about-items">
                <Link href="/#about" className={activeHash === "about" ? "active" : ""}>
                  <T th="เกี่ยวกับ" en="About" />
                </Link>
                <Link href="/#testimonials" className={activeHash === "testimonials" ? "active" : ""}>
                  <T th="รีวิว" en="Reviews" />
                </Link>
                <Link href="/#faq" className={activeHash === "faq" ? "active" : ""}>
                  <T th="FAQ" en="FAQs" />
                </Link>
                <Link href="/#follow" className={activeHash === "follow" ? "active" : ""}>
                  <T th="ติดตาม" en="Follow" />
                </Link>
              </div>
            </div>
            <div className="about-group">
              <Link href="/blog" className={`about-main ${pathname === "/blog" ? "active" : ""}`}>
                <T th="บทความ" en="Blog" />
              </Link>
              <div className="about-items">
                <Link href="/blog?tag=Finance">
                  <T th="การเงิน" en="Finance" />
                </Link>
                <Link href="/blog?tag=Psychology">
                  <T th="จิตวิทยา" en="Psychology" />
                </Link>
                <Link href="/blog?tag=Trading Systems">
                  <T th="ระบบเทรด" en="Trading systems" />
                </Link>
              </div>
            </div>
            <div className="about-group">
              <Link href="/products" className={`about-main ${pathname.startsWith("/products") ? "active" : ""}`}>
                <T th="สินค้า" en="Products" />
              </Link>
              <div className="about-items">
                <Link href="/products#ebook" className={activeHash === "ebook" ? "active" : ""}>
                  <T th="หนังสือ E-book" en="E-books" />
                </Link>
                <Link href="/products#products" className={activeHash === "products" ? "active" : ""}>
                  <T th="เครื่องมืออื่นๆ" en="Other Tools" />
                </Link>
                <Link href="/products#algo" className={activeHash === "algo" ? "active" : ""}>
                  <T th="Algo" en="Algo" />
                </Link>
              </div>
            </div>
            <div className={`about-group ${pathname.startsWith("/grade") || pathname.startsWith("/quiz") ? "open" : ""}`}>
              <Link href="/grade" className={`about-main ${pathname.startsWith("/grade") ? "active" : ""}`}>
                <T th="เรียนเทรด" en="Learn" />
              </Link>
              <div className="about-items">
                <Link href="/grade">
                  <T th="หลักสูตร 8 ระดับ" en="8-level course" />
                </Link>
                <Link href="/quiz" className={pathname.startsWith("/quiz") ? "active" : ""}>
                  <T th="แบบทดสอบเทรดเดอร์" en="Trader quiz" />
                </Link>
              </div>
            </div>
            <div className={`about-group ${pathname.startsWith("/research") ? "open" : ""}`}>
              <Link href="/research" className={`about-main ${pathname.startsWith("/research") ? "active" : ""}`}>
                <T th="วิเคราะห์หุ้น" en="Research" />
              </Link>
            </div>
          </nav>
          <div className="nav-right">
            <div className="lang-toggle" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                }}
                title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              >
                {themeIcon}
              </button>
              <div style={{ width: "1px", height: "14px", background: "var(--line)" }}></div>
              <div>
                <button className={lang === "th" ? "active" : ""} onClick={() => setLang("th")}>
                  TH
                </button>
                <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
                  EN
                </button>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="nav-account" ref={accountRef}>
                <button
                  type="button"
                  className="btn nav-cta"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((v) => !v)}
                  style={{
                    background: "var(--card)",
                    color: "var(--ink)",
                    border: "1px solid var(--line)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 14px 5px 6px",
                    borderRadius: "24px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Google Profile Picture or Fallback Letter */}
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid var(--line)",
                        display: "block",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: "var(--ink)",
                        color: "var(--bg)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {initialLetter}
                    </span>
                  )}
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    {user?.name ? user.name.split(" ")[0] : <T th="บัญชี" en="Account" />}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: accountOpen ? "rotate(180deg)" : "none",
                      transition: "transform .2s",
                      opacity: 0.7,
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {accountOpen && (
                  <div
                    className="nav-account-menu"
                    role="menu"
                    style={{
                      minWidth: "240px",
                      padding: "8px",
                      borderRadius: "10px",
                      boxShadow: "0 16px 36px rgba(0,0,0,0.3)",
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                    }}
                  >
                    {/* User Profile Card */}
                    <div
                      style={{
                        padding: "10px 12px 12px",
                        borderBottom: "1px solid var(--line-soft, var(--line))",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {user?.picture ? (
                          <img
                            src={user.picture}
                            alt={displayName}
                            referrerPolicy="no-referrer"
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid var(--line)",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              border: "1px solid var(--line)",
                              background: "var(--card)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--mono)",
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "var(--gold)",
                              flexShrink: 0,
                            }}
                          >
                            {initialLetter}
                          </div>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: "13.5px",
                              fontWeight: 600,
                              color: "var(--ink)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {displayName}
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--mono)",
                              color: "var(--muted)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginTop: "1px",
                            }}
                          >
                            {displayEmail}
                          </div>
                        </div>
                      </div>

                      {user?.isPremium && (
                        <div style={{ marginTop: "8px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              fontFamily: "var(--mono)",
                              fontSize: "9.5px",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "var(--gold)",
                              border: "1px solid var(--gold)",
                              borderRadius: "3px",
                              padding: "1px 6px",
                            }}
                          >
                            Pro Member
                          </span>
                        </div>
                      )}
                    </div>

                    {journalEnabled && (
                      <Link
                        href="/journal"
                        role="menuitem"
                        onClick={() => setAccountOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <T th="บันทึกเทรด (Journal)" en="Trading Journal" />
                      </Link>
                    )}

                    <Link
                      href="/plan/portfolio"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      <T th="พอร์ตลงทุน (Portfolio)" en="Portfolio" />
                    </Link>

                    <form action={logout} className="nav-account-signout" style={{ marginTop: "6px", paddingTop: "6px" }}>
                      <button
                        type="submit"
                        role="menuitem"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          width: "100%",
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <T th="ออกจากระบบ" en="Sign out" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-login-wrapper" ref={loginRef} style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setLoginOpen((v) => !v)}
                  className="btn nav-cta"
                  aria-expanded={loginOpen}
                  style={{
                    background: "var(--ink)",
                    color: "var(--bg)",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    borderRadius: "4px",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <T th="เข้าสู่ระบบ" en="Sign in" />
                </button>

                {/* Small non-intrusive Google Login Dropdown Tab */}
                {loginOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "260px",
                      background: "var(--bg)",
                      border: "1px solid var(--line)",
                      borderRadius: "10px",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.25)",
                      padding: "16px",
                      zIndex: 80,
                      boxSizing: "border-box",
                      animation: "loginTabFade 0.18s ease-out",
                    }}
                  >
                    <style jsx>{`
                      @keyframes loginTabFade {
                        from {
                          opacity: 0;
                          transform: translateY(-6px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>

                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--ink)",
                          marginBottom: "4px",
                        }}
                      >
                        <T th="เข้าสู่ระบบ Cerfinits" en="Sign in to Cerfinits" />
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          lineHeight: 1.4,
                        }}
                      >
                        <T
                          th="เข้าสู่ระบบด้วย Google บัญชีเดียวใช้งานได้ทุกระบบ"
                          en="Sign in with Google to access all features"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginOpen(false);
                        handleGoogleLogin();
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#ffffff",
                        color: "#3c4043",
                        border: "1px solid #dadce0",
                        borderRadius: "7px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        boxSizing: "border-box",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#ffffff";
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      <span style={{ color: "#3c4043", fontWeight: 500 }}>
                        <T th="ดำเนินการต่อด้วย Google" en="Continue with Google" />
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className={`nav-burger ${menuOpen ? "open" : ""}`}
            aria-label={lang === "en" ? "Menu" : "เมนู"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <nav className="mm-links" aria-label={lang === "en" ? "Site" : "เมนูเว็บไซต์"}>
            <Link href="/" className={isHome ? "active" : ""}>
              <T th="หน้าแรก" en="Home" />
            </Link>
            <Link href="/#about">
              <T th="เกี่ยวกับ" en="About" />
            </Link>
            <Link href="/#testimonials">
              <T th="รีวิว" en="Reviews" />
            </Link>
            <Link href="/#faq">
              <T th="FAQ" en="FAQs" />
            </Link>
            <Link href="/blog" className={pathname === "/blog" ? "active" : ""}>
              <T th="บทความ" en="Blog" />
            </Link>
            <Link href="/products" className={pathname.startsWith("/products") ? "active" : ""}>
              <T th="สินค้า" en="Products" />
            </Link>
            <Link href="/grade" className={pathname.startsWith("/grade") ? "active" : ""}>
              <T th="เรียนเทรด" en="Learn" />
            </Link>
            <Link href="/quiz" className={pathname.startsWith("/quiz") ? "active" : ""}>
              <T th="แบบทดสอบเทรดเดอร์" en="Trader quiz" />
            </Link>
            <Link href="/research" className={pathname.startsWith("/research") ? "active" : ""}>
              <T th="วิเคราะห์หุ้น" en="Research" />
            </Link>
          </nav>

          <div className="mm-cta">
            {isLoggedIn ? (
              <>
                {/* User card in mobile menu */}
                <div
                  style={{
                    padding: "12px 14px",
                    background: "var(--card)",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid var(--line)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--ink)",
                        color: "var(--bg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--mono)",
                        fontSize: "14px",
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {initialLetter}
                    </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{displayName}</div>
                    <div style={{ fontSize: "11px", fontFamily: "var(--mono)", color: "var(--muted)" }}>{displayEmail}</div>
                  </div>
                  {user?.isPremium && (
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        border: "1px solid var(--gold)",
                        borderRadius: "2px",
                        padding: "2px 5px",
                      }}
                    >
                      PRO
                    </span>
                  )}
                </div>

                {journalEnabled && (
                  <Link href="/journal" className="btn" onClick={() => setMenuOpen(false)}>
                    <T th="บันทึกเทรด (Journal)" en="Journal" />
                  </Link>
                )}
                <Link href="/plan/portfolio" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  <T th="พอร์ตลงทุน (Portfolio)" en="Portfolio" />
                </Link>
                <form action={logout}>
                  <button type="submit" className="btn" style={{ width: "100%" }}>
                    <T th="ออกจากระบบ" en="Sign out" />
                  </button>
                </form>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setMenuOpen(false);
                  handleGoogleLogin();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <T th="เข้าสู่ระบบด้วย Google" en="Sign in with Google" />
              </button>
            )}
          </div>

          <div className="mm-foot">
            <button type="button" className="mm-theme" onClick={toggleTheme}>
              {themeIcon}
              <span>{theme === "dark" ? (lang === "en" ? "Light mode" : "โหมดสว่าง") : lang === "en" ? "Dark mode" : "โหมดมืด"}</span>
            </button>
            <div className="mm-lang">
              <button className={lang === "th" ? "active" : ""} onClick={() => setLang("th")}>
                TH
              </button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
                EN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
