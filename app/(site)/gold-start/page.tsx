import type { Metadata } from "next";
import { T } from "@/components/site/LangContext";

// Generated from gold-start-index.html by scripts/convert-gold-start.mjs — edit freely,
// but re-running the script will overwrite this file.
export const metadata: Metadata = {
  title: "GOLD START — สารบัญเล่ม · Cerfinits",
  description: "จากศูนย์สู่ออเดอร์ทองคำแรกของคุณ — กดเลือกบทที่อยากอ่านได้เลย",
  alternates: { canonical: "/gold-start" },
};

import { getCurrentUser } from "@/lib/actions/auth";
import { isChapterPremium } from "@/lib/curriculum";
import { redirect } from "next/navigation";
import ChapterCompleteButton from "@/components/site/ChapterCompleteButton";
import PremiumPaywall from "@/components/site/PremiumPaywall";

export default async function Page() {
  const chapterId = "S1";
  const user = await getCurrentUser();
  const isPremiumRequired = isChapterPremium(chapterId);

  // 1. Not logged in -> Redirect to login
  if (!user && isPremiumRequired) {
    redirect("/login?callbackUrl=/gold-start");
  }

  const isPremiumUser = user?.isPremium || false;
  const isCompleted = user?.completedChapters?.includes(chapterId) || false;

  return (
    <>
      <div className="book">
        <div className="wrap" style={{ paddingTop: '20px', paddingBottom: '0' }}>
          <a href="/grade" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }} className="hover-gold">
            <span style={{ fontSize: '18px', lineHeight: 1 }}>←</span> <T th="กลับหน้าหลักสูตร" en="Back to Curriculum" />
          </a>
        </div>
        <div className="wrap runhead" style={{ marginTop: '10px' }}>
          <span className="brand"><span className="dot"></span> Cerfinits</span>
          <span>EDGE + DISCIPLINE = SUCCESS</span>
        </div>

        <div className="wrap opener" style={{ padding: "72px 0 44px" }}>
          <span className="kicker"><T th="E-BOOK · สารบัญเล่ม" en="E-BOOK · Table of Contents" /></span>
          <h1>GOLD START</h1>
          <p className="lead"><T th="จากศูนย์สู่ออเดอร์ทองคำแรกของคุณ — กดเลือกบทที่อยากอ่านได้เลย" en="From zero to your first gold order — select a chapter to begin." /></p>
        </div>

        <PremiumPaywall isPremium={isPremiumUser || !isPremiumRequired}>

          <div className="wrap content" style={{ padding: "30px 0 70px" }}>

            <div className="tl-part"><T th="ภาค 1 — เปลี่ยนความคิด" en="Part 1 — Mindset Shift" /></div>
          <a className="tl" href="/gold-start/ch01"><span className="tn">01</span><span className="tt"><T th="ความจริงที่ไม่มีใครบอกมือใหม่" en="The Truth Nobody Tells Beginners" /></span><span className="ta">→</span></a>

          <div className="tl-part"><T th="ภาค 2 — รู้จักสนามรบ" en="Part 2 — Knowing the Battlefield" /></div>
          <a className="tl" href="/gold-start/ch02"><span className="tn">02</span><span className="tt"><T th="ทองคำ (XAUUSD) สนามที่เราเลือกเล่น" en="Gold (XAUUSD) Our Chosen Field" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/ch03"><span className="tn">03</span><span className="tt"><T th="เปิดบัญชีเดโม + ทัวร์หน้าจอ" en="Open a Demo Account + Platform Tour" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/ch04"><span className="tn">04</span><span className="tt"><T th="ภาษาของเทรดเดอร์" en="The Language of Traders" /></span><span className="ta">→</span></a>

          <div className="tl-part"><T th="ภาค 3 — อ่านเกมให้เป็น" en="Part 3 — Reading the Game" /></div>
          <a className="tl" href="/gold-start/ch05"><span className="tn">05</span><span className="tt"><T th="อ่านกราฟด้วยสายตาแบบ Cerfinits" en="Reading Charts the Cerfinits Way" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/ch06"><span className="tn">06</span><span className="tt"><T th="Risk Management — บทที่สำคัญที่สุด" en="Risk Management — The Most Important Chapter" /></span><span className="ta">→</span></a>

          <div className="tl-part"><T th="ภาค 4 — ลงสนาม" en="Part 4 — Taking Action" /></div>
          <a className="tl" href="/gold-start/ch07"><span className="tn">07</span><span className="tt"><T th="กายวิภาคออเดอร์ + เซ็ตอัพล้อจักรยาน" en="Order Anatomy + Bicycle Setup" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/ch08"><span className="tn">08</span><span className="tt"><T th="จิตวิทยา + สมุดบันทึกเทรด" en="Psychology + Trading Journal" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/ch09"><span className="tn">09</span><span className="tt"><T th="ออเดอร์เดโมแรกของคุณ + แผน 7 วัน" en="Your First Demo Order + 7-Day Plan" /></span><span className="ta">→</span></a>

          <div className="tl-part"><T th="ภาค 5 — ก้าวต่อไป" en="Part 5 — Moving Forward" /></div>
          <a className="tl" href="/gold-start/ch10"><span className="tn">10</span><span className="tt"><T th="จากเดโมสู่เทรดเดอร์ตัวจริง" en="From Demo to Real Trader" /></span><span className="ta">→</span></a>

          <div className="tl-part"><T th="ภาคผนวก" en="Appendix" /></div>
          <a className="tl" href="/gold-start/cheatsheet"><span className="tn">★</span><span className="tt"><T th="Cheat Sheet — ก่อนกดออเดอร์" en="Cheat Sheet — Before Execution" /></span><span className="ta">→</span></a>
          <a className="tl" href="/gold-start/glossary"><span className="tn">A–Z</span><span className="tt"><T th="อภิธานศัพท์" en="Glossary" /></span><span className="ta">→</span></a>

          </div>
        </PremiumPaywall>



        <div className="wrap bookfoot">
          <span>CERFINITS — GOLD START</span>
          <span>discord.gg/jANDuDvn</span>
        </div>

      </div>
    </>
  );
}
