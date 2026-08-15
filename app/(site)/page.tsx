import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/site/LangContext";
import SiteHeader from "@/components/site/SiteHeader";
import { journalNavEnabled } from "@/lib/journal/auth-config";
import SiteFooter from "@/components/site/SiteFooter";
import NewsletterForm from "@/components/site/NewsletterForm";

export const metadata: Metadata = {
  title: "Cerfinits — Edge + Discipline = Success",
  description:
    "Cerfinits — บทเรียน บทวิเคราะห์ และเครื่องมือด้านการเทรดและการลงทุน: หลักสูตร Cerfinits Grade, บทวิเคราะห์หุ้นสหรัฐ, สมุดบันทึกการเทรด, การวางแผนพอร์ตลงทุน และ e-book",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "Cerfinits",
    title: "Cerfinits — Edge + Discipline = Success",
    description:
      "บทเรียน บทวิเคราะห์ และเครื่องมือด้านการเทรดและการลงทุน — หลักสูตร บทวิเคราะห์หุ้น สมุดบันทึกการเทรด และการวางแผนพอร์ต",
    type: "website",
    url: "/",
    locale: "th_TH",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Cerfinits — Edge + Discipline = Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerfinits — Edge + Discipline = Success",
    description: "บทเรียน บทวิเคราะห์ และเครื่องมือด้านการเทรดและการลงทุน",
    images: ["/og-cover.png"],
  },
};

function TickerItems() {
  return (
    <>
      <span><T th="ระบบเทรด" en="Trading Systems" /></span>
      <span><T th="จิตวิทยา & วินัย" en="Mindset & Discipline" /></span>
      <span>Risk Management</span>
      <span>High R:R Mindset</span>
      <span><T th="ทำซ้ำได้" en="Repeatable Process" /></span>
    </>
  );
}

import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/actions/auth";

export default async function HomePage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("cerfinits_auth");
  const user = isLoggedIn ? await getCurrentUser() : null;

  return (
    <div className="page">
      <SiteHeader isLoggedIn={isLoggedIn} user={user} journalEnabled={journalNavEnabled()} />

      <main id="top">
        {/* HERO */}
        <section className="hero hero-ambient">
          <div className="wrap">
            <span className="tag reveal">
              <b><T th="ใหม่" en="NEW" /></b>
              <span><T th="บทเรียน · บทวิเคราะห์ · เครื่องมือ" en="Courses · Research · Tools" /></span>
            </span>
            <h1>
              <span className="hw">Edge</span> <span className="hw">+</span> <span className="hw">Discipline</span><br />
              <span className="thin hw">= Success</span>
            </h1>
            <p className="lead reveal">
              <T
                th="Cerfinits รวมบทเรียน บทวิเคราะห์ และเครื่องมือด้านการเทรดและการลงทุน สำหรับผู้ที่ต้องการตัดสินใจอย่างเป็นระบบและตรวจสอบได้"
                en="Cerfinits brings together courses, research, and tools for trading and investing, for anyone who wants decisions they can systematise and verify."
              />
            </p>
            <div className="hero-cta reveal">
              <a href="#products" className="btn"><T th="ดูสินค้าทั้งหมด" en="Browse products" /></a>
              <a href="#community" className="btn ghost"><T th="เข้าร่วม Discord" en="Join Discord" /></a>
            </div>
          </div>
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              <TickerItems />
              <TickerItems />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about">
          <div className="wrap about-grid">
            <div className="reveal">
              <span className="eyebrow"><T th="เกี่ยวกับ" en="About" /></span>
              <h2 className="section-title">
                <T
                  th={<>ตัดสินใจอย่างเป็นระบบ<br />บนหลักฐานที่ตรวจสอบได้</>}
                  en={<>Decisions built on a system,<br />and on evidence you can check</>}
                />
              </h2>
            </div>
            <div className="reveal">
              <p className="body">
                <T
                  th="Cerfinits เริ่มต้นจากคอนเทนต์การเทรดบน Instagram, TikTok และ Facebook และขยายมาเป็นหลักสูตร บทวิเคราะห์หุ้น สมุดบันทึกการเทรด และการวางแผนพอร์ตลงทุน — ทั้งหมดสร้างขึ้นเพื่อช่วยให้คุณมีกรอบการตัดสินใจที่ชัดเจน มีวินัย และทำซ้ำได้ครับ"
                  en="Cerfinits began as trading content on Instagram, TikTok and Facebook, and has grown into a course, stock research, a trading journal, and portfolio planning — all built to give you a decision framework that is clear, disciplined, and repeatable."
                />
              </p>
              <div className="quote">
                <div className="q">“Edge + Discipline = Success”</div>
                <div className="qs">
                  <T
                    th="ปรัชญาเดียวที่อยู่เบื้องหลังทุกบทเรียนและทุกเครื่องมือ"
                    en="The one philosophy behind every lesson and every tool."
                  />
                </div>
              </div>
              <div className="pill-row">
                <span className="pill"><T th="ระบบเทรด" en="Trading systems" /></span>
                <span className="pill"><T th="จิตวิทยา & วินัย" en="Mindset & discipline" /></span>
                <span className="pill"><T th="บริหารความเสี่ยง" en="Risk management" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials">
          <div className="wrap">
            <span className="eyebrow reveal"><T th="รีวิว" en="Testimonials" /></span>
            <h2 className="section-title reveal">
              <T th={<>เสียงจากคนใน<br />คอมมูนิตี้</>} en={<>What people inside<br />are saying</>} />
            </h2>
            <p className="section-sub reveal">
              <T
                th="* ข้อความตัวอย่าง — แทนที่ด้วยรีวิวจริงจากคอมมูนิตี้ของคุณ"
                en="* Placeholder quotes — replace with real reviews from your community."
              />
            </p>

            <div className="testi-grid">
              <div className="testi reveal-scale">
                <p>
                  <T
                    th="อ่านเล่ม COT จบแล้วเปิดรายงาน CFTC เป็นครั้งแรกในชีวิต — ตอนนี้ใช้เป็นฟิลเตอร์ทิศทางก่อนเข้าทุกไม้"
                    en="Finished the COT book and opened a CFTC report for the first time ever — now it's my direction filter before every trade."
                  />
                </p>
                <span className="who"><T th="— คุณเบส" en="— Best" /></span>
              </div>
              <div className="testi reveal-scale">
                <p>
                  <T
                    th={<>The Lion&apos;s Heart อ่านง่าย ตรงประเด็น ไม่ขายฝัน — โดนใจตรง &quot;นิ่งเป็น เย็นพอ รอได้&quot;</>}
                    en={<>The Lion&apos;s Heart is clear and honest, no hype — &quot;stay calm, stay cool, wait it out&quot; hit home.</>}
                  />
                </p>
                <span className="who"><T th="— คุณปอนด์" en="— Pond" /></span>
              </div>
              <div className="testi reveal-scale">
                <p>
                  <T
                    th="คอมมูนิตี้ใน Discord ช่วยได้เยอะ มีคนรีวิวแผนเทรดให้ก่อนเข้าออเดอร์"
                    en="The Discord community is a huge help — people review my trade plans before I enter."
                  />
                </p>
                <span className="who"><T th="— คุณนัท" en="— Nut" /></span>
              </div>
              <div className="testi reveal-scale">
                <p>
                  <T
                    th="ICT & MMM Guide สรุปเข้าใจง่ายกว่าไปนั่งไล่ดูคลิปเป็นร้อยชั่วโมง — FVG กับ Order Block ชัดขึ้นมาก"
                    en="The ICT & MMM Guide beats watching a hundred hours of videos — FVG and Order Blocks finally make sense."
                  />
                </p>
                <span className="who"><T th="— คุณมิว" en="— Mew" /></span>
              </div>
              <div className="testi reveal-scale">
                <p>
                  <T
                    th="ชอบที่คอนเทนต์เน้น R:R สูงและการรอจังหวะ ไม่ใช่เทรดถี่ๆ"
                    en="Love that the content focuses on high R:R and patience, not overtrading."
                  />
                </p>
                <span className="who"><T th="— คุณก้อง" en="— Kong" /></span>
              </div>
              <div className="testi reveal-scale">
                <p>
                  <T
                    th="เทมเพลตจดบันทึก COT รายสัปดาห์ + เช็กลิสต์ก่อนเข้าเทรดในเล่ม ใช้งานได้จริง ประหยัดเวลามาก"
                    en="The weekly COT log template + pre-trade checklist in the book are genuinely useful — big time-saver."
                  />
                </p>
                <span className="who"><T th="— คุณเฟิร์ส" en="— First" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <span className="eyebrow reveal"><T th="คำถามที่พบบ่อย" en="FAQs" /></span>
            <h2 className="section-title reveal">
              <T th={<>มีคำถาม?<br />เรามีคำตอบ</>} en={<>Got questions?<br />We&apos;ve got answers.</>} />
            </h2>

            <div className="faq-list reveal">
              <details className="faq-item">
                <summary>
                  <span className="num">01</span>
                  <span><T th="สินค้าส่งมอบยังไง?" en="How are products delivered?" /></span>
                  <span className="plus">+</span>
                </summary>
                <div className="ans">
                  <T
                    th="ทุกชิ้นเป็นไฟล์ดิจิทัล ส่งผ่าน Gumroad — ชำระเงินเสร็จดาวน์โหลดได้ทันที และได้รับลิงก์ทางอีเมลด้วย"
                    en="Everything is digital, delivered via Gumroad — download instantly after checkout, with a link sent to your email."
                  />
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="num">02</span>
                  <span><T th="เหมาะกับมือใหม่ไหม?" en="Is this beginner-friendly?" /></span>
                  <span className="plus">+</span>
                </summary>
                <div className="ans">
                  <T
                    th={<>เหมาะ — The Lion&apos;s Heart เริ่มจากพื้นฐานจิตใจและวินัย ส่วนเล่ม COT กับ ICT &amp; MMM ขอแค่รู้พื้นฐานการเทรดเบื้องต้นก็อ่านตามได้</>}
                    en={<>Yes — The Lion&apos;s Heart starts from mindset and discipline fundamentals, while the COT and ICT &amp; MMM books only require basic trading knowledge.</>}
                  />
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="num">03</span>
                  <span><T th="มีแจกซิกแนลไหม?" en="Do you provide signals?" /></span>
                  <span className="plus">+</span>
                </summary>
                <div className="ans">
                  <T
                    th="ไม่มี — เป้าหมายคือสอนให้คุณมีระบบของตัวเองที่ยั่งยืน ไม่ใช่พึ่งซิกแนลคนอื่น"
                    en="No — the goal is to teach you a sustainable system of your own, not dependence on someone else's signals."
                  />
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="num">04</span>
                  <span><T th="ติดปัญหาแล้วถามใครได้?" en="What if I get stuck?" /></span>
                  <span className="plus">+</span>
                </summary>
                <div className="ans">
                  <T
                    th="เข้ามาถามใน Discord ได้เลย — ฟรี มีทั้งผมและสมาชิกคนอื่นช่วยตอบ"
                    en="Ask in the Discord — it's free, and both me and other members are there to help."
                  />
                </div>
              </details>
              <details className="faq-item">
                <summary>
                  <span className="num">05</span>
                  <span><T th="ขอคืนเงินได้ไหม?" en="What is the refund policy?" /></span>
                  <span className="plus">+</span>
                </summary>
                <div className="ans">
                  <T
                    th="เนื่องจากเป็นสินค้าดิจิทัล จึงไม่มีนโยบายคืนเงิน — หากมีข้อสงสัยสอบถามก่อนซื้อได้เสมอ"
                    en="As these are digital products, all sales are final — feel free to ask any questions before purchasing."
                  />
                </div>
              </details>
            </div>
            <p className="faq-contact reveal">
              <T
                th={<>ยังมีคำถาม? ทักมาใน <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">Discord</a> ได้เลย</>}
                en={<>Still have questions? Ping me on <a href="https://discord.gg/jANDuDvn" target="_blank" rel="noopener">Discord</a>.</>}
              />
            </p>
          </div>
        </section>

        {/* FOLLOW */}
        <section id="follow">
          <div className="wrap">
            <span className="eyebrow reveal"><T th="ติดตาม" en="Follow" /></span>
            <h2 className="section-title reveal"><T th="เจอกันทุกช่องทาง" en="Find me everywhere" /></h2>
            <p className="section-sub reveal">
              <T
                th="ช่องทางหลักของผมอยู่บน Instagram, TikTok และ Facebook — ติดตามเพื่อไม่พลาดคอนเทนต์ใหม่ครับ"
                en="My main channels are Instagram, TikTok and Facebook — follow to never miss a post."
              />
            </p>

            <div className="social-grid">
              <a className="social reveal-scale" href="https://www.instagram.com/crzin_s" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg></span>
                <span className="meta"><b>Instagram</b><span>@crzin_s</span></span>
                <span className="arrow">↗</span>
              </a>
              <a className="social reveal-scale" href="https://www.tiktok.com/@zins_trade" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.4-2.6 5.6-5.6 5.4-2.7-.2-4.7-2.5-4.6-5.2.1-2.6 2.3-4.7 5-4.6.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.2 0-2.2 1-2.1 2.2 0 1.2 1 2.1 2.2 2.1 1.2 0 2.1-1 2.1-2.3V3h2.6z" /></svg></span>
                <span className="meta"><b>TikTok</b><span>@zins_trade</span></span>
                <span className="arrow">↗</span>
              </a>
              <a className="social reveal-scale" href="https://www.facebook.com/Cerfinits" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg></span>
                <span className="meta"><b>Facebook</b><span>/Cerfinits</span></span>
                <span className="arrow">↗</span>
              </a>
              <a className="social reveal-scale" href="https://www.threads.com/@crzin_s" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.3 21.5c-3 0-5.2-1-6.6-3-1.2-1.7-1.8-4-1.8-6.5s.6-4.8 1.8-6.5c1.4-2 3.6-3 6.6-3 2.6 0 4.6.8 6 2.4.6.7 1.1 1.6 1.4 2.6l-2 .6c-.2-.7-.5-1.3-.9-1.8-.9-1-2.3-1.6-4.4-1.6-2.2 0-3.8.7-4.8 2.1-.9 1.3-1.4 3.1-1.4 5.2s.5 3.9 1.4 5.2c1 1.4 2.6 2.1 4.8 2.1 1.9 0 3.2-.5 4.1-1.4.5-.5.8-1.1 1-1.8-.6.3-1.4.5-2.2.5-2.4 0-4.2-1.4-4.2-3.4 0-1.9 1.7-3.2 4-3.2 1.3 0 2.5.4 3.3 1.2 0-.3 0-.6-.1-.9l2 .2c.4 2.4-.1 4.8-1.6 6.5-1.4 1.6-3.4 2.4-5.9 2.4zm.8-8.4c-1.3 0-2.1.6-2.1 1.4 0 .9 1 1.4 2.1 1.4 1.4 0 2.5-.7 2.6-2.1-.7-.5-1.6-.7-2.6-.7z" /></svg></span>
                <span className="meta"><b>Threads</b><span>@crzin_s</span></span>
                <span className="arrow">↗</span>
              </a>
              <a className="social reveal-scale" href="https://www.youtube.com/@Zintrade" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.2-.4-4.7c-.2-.9-.9-1.5-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4c-.8.2-1.5.8-1.7 1.7C1 8.8 1 12 1 12s0 3.2.4 4.7c.2.9.9 1.5 1.7 1.7 1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4c.8-.2 1.5-.8 1.7-1.7.4-1.5.4-4.7.4-4.7zM9.8 15V9l5.2 3-5.2 3z" /></svg></span>
                <span className="meta"><b>YouTube</b><span>@Zintrade</span></span>
                <span className="arrow">↗</span>
              </a>
              <a className="social reveal-scale" href="https://x.com/crzin_s" target="_blank" rel="noopener">
                <span className="ico"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.8-6.3L5.5 22H2.7l7-8L2 2h6.3l4.3 5.7L18.2 2zm-2.2 18h1.7L8 4H6.2l9.8 16z" /></svg></span>
                <span className="meta"><b>X (Twitter)</b><span>@crzin_s</span></span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section id="newsletter">
          <div className="wrap">
            <span className="eyebrow reveal"><T th="จดหมายข่าว" en="Newsletter" /></span>
            <h2 className="section-title reveal">
              <T
                th={<>รับคอนเทนต์ + เครื่องมือฟรี<br />ทางอีเมล</>}
                en={<>Free content + tools,<br />straight to your inbox</>}
              />
            </h2>
            <p className="section-sub reveal">
              <T
                th="setup ระบบเทรด, อัพเดต Algo และของแจกฟรีใหม่ ๆ ส่งตรงถึงอีเมลคุณ — ไม่มีสแปม ยกเลิกได้ทุกเมื่อ"
                en="Trading setups, Algo updates and new free drops — sent straight to you. No spam, unsubscribe anytime."
              />
            </p>
            <NewsletterForm />
            <p className="news-note reveal">
              <T
                th="เราเก็บอีเมลเพื่อส่งคอนเทนต์เท่านั้น · เพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน"
                en="We only use your email to send content · For education only, not investment advice."
              />
              {" · "}
              <Link href="/unsubscribe">
                <T th="ยกเลิกและลบอีเมล" en="Unsubscribe and delete" />
              </Link>
              {" · "}
              <Link href="/privacy">
                <T th="ความเป็นส่วนตัว" en="Privacy" />
              </Link>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="wrap cta-inner reveal">
            <h2>
              <T
                th={<>พร้อมสร้าง edge<br /><span className="thin">ของคุณหรือยัง?</span></>}
                en={<>Ready to build<br /><span className="thin">your edge?</span></>}
              />
            </h2>
            <p>
              <T
                th="เริ่มจากเครื่องมือที่ทำให้การเทรดของคุณเป็นระบบมากขึ้น วันนี้"
                en="Start with the tools that make your trading more systematic — today."
              />
            </p>
            <Link href="/products" className="btn"><T th="ดูสินค้าทั้งหมด" en="Browse products" /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
