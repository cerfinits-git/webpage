"use client";

import Link from "next/link";
import { T } from "./LangContext";
import LogoMark from "@/components/LogoMark";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/#top" className="brand">
              <LogoMark /> <span>Cerfinits</span>
            </Link>
            <p>
              <T
                th="Edge + Discipline = Success — คอนเทนต์เทรดและ digital products สำหรับเทรดเดอร์ที่มีวินัย"
                en="Edge + Discipline = Success — trading content and digital products for disciplined traders."
              />
            </p>
          </div>
          <div className="foot-col">
            <h4>SOCIAL</h4>
            <a href="https://www.instagram.com/crzin_s" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.tiktok.com/@zins_trade" target="_blank" rel="noopener">TikTok</a>
            <a href="https://www.facebook.com/Cerfinits" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.youtube.com/@Zintrade" target="_blank" rel="noopener">YouTube</a>
            <a href="https://x.com/crzin_s" target="_blank" rel="noopener">X (Twitter)</a>
            <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">Discord</a>
          </div>
          <div className="foot-col">
            <h4><T th="เมนูลัด" en="QUICK MENU" /></h4>
            <Link href="/#about"><T th="เกี่ยวกับ" en="About" /></Link>
            <Link href="/blog"><T th="บทความ" en="Blog" /></Link>
            <Link href="/products"><T th="สินค้า" en="Products" /></Link>
            <Link href="/quiz"><T th="แบบทดสอบเทรดเดอร์" en="Trader quiz" /></Link>
            <Link href="/algo">Algo SDV.1</Link>
            <Link href="/#faq"><T th="FAQ" en="FAQs" /></Link>
            <Link href="/privacy"><T th="ความเป็นส่วนตัว" en="Privacy" /></Link>
            <Link href="/terms"><T th="เงื่อนไขการใช้บริการ" en="Terms" /></Link>
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
