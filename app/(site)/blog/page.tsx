import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/site/JsonLd";
import { T } from "@/components/site/LangContext";

import { POSTS } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "บทความ — ความรู้เทรดทอง COT, จิตวิทยา, ICT | Cerfinits",
  description:
    "บทความสั้นๆ อ่านง่าย เรื่องการเทรดทอง XAUUSD อย่างมีระบบ: อ่าน COT ตามรอยเงินรายใหญ่, จิตวิทยาและวินัยการเทรด และพื้นฐาน ICT / Market Maker Model",
  alternates: { canonical: "/blog" },
  openGraph: {
    siteName: "Cerfinits",
    title: "บทความ Cerfinits — ความรู้เทรดทองอย่างมีระบบ",
    description: "COT, จิตวิทยาการเทรด และ ICT / Market Maker Model — สรุปสั้น อ่านง่าย ใช้ได้จริง",
    type: "website",
    url: "/blog",
    locale: "th_TH",
    images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "บทความ Cerfinits — ความรู้เทรดทองอย่างมีระบบ",
    images: ["/og-cover.png"],
  },
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogHubPage(props: Props) {
  const resolvedParams = await props.searchParams;
  const currentTag = resolvedParams.tag;
  
  const displayPosts = currentTag 
    ? POSTS.filter((p) => p.tag === currentTag)
    : POSTS;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Cerfinits Blog",
          url: `${SITE_URL}/blog`,
          description: "บทความความรู้การเทรดทอง XAUUSD อย่างมีระบบ — COT, จิตวิทยา, ICT",
          publisher: {
            "@type": "Organization",
            name: "Cerfinits",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/og-cover.png` },
          },
          blogPost: POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.dateISO,
          })),
        }}
      />

      <section className="blog-hero">
        <div className="wrap">
          <span className="eyebrow"><T th="บทความ" en="Blog" /></span>
          <h1>
            <T th={<>ความรู้เทรดทอง<br />อย่างมีระบบ</>} en={<>Systematic Gold<br />Trading Knowledge</>} />
          </h1>
          <p>
            <T 
              th="สรุปสั้น อ่านง่าย ใช้ได้จริง — เรื่อง COT, จิตวิทยาการเทรด และ ICT สำหรับเทรดเดอร์ที่อยากเทรดเป็นระบบ ไม่ใช่เดา" 
              en="Short, easy to read, and practical — COT, trading psychology, and ICT for traders who want a system, not guesswork." 
            />
          </p>
          
          {/* Category Filter Pills */}
          <div className="pill-row" style={{ marginTop: '24px' }}>
            <Link href="/blog" className={`pill ${!currentTag ? 'active' : ''}`} style={!currentTag ? { background: 'var(--ink)', color: 'var(--bg)' } : {}}>
              <T th="ทั้งหมด" en="All" />
            </Link>
            <Link href="/blog?tag=Finance" className={`pill ${currentTag === 'Finance' ? 'active' : ''}`} style={currentTag === 'Finance' ? { background: 'var(--ink)', color: 'var(--bg)' } : {}}>
              <T th="การเงิน" en="Finance" />
            </Link>
            <Link href="/blog?tag=Psychology" className={`pill ${currentTag === 'Psychology' ? 'active' : ''}`} style={currentTag === 'Psychology' ? { background: 'var(--ink)', color: 'var(--bg)' } : {}}>
              <T th="จิตวิทยา" en="Psychology" />
            </Link>
            <Link href="/blog?tag=Trading Systems" className={`pill ${currentTag === 'Trading Systems' ? 'active' : ''}`} style={currentTag === 'Trading Systems' ? { background: 'var(--ink)', color: 'var(--bg)' } : {}}>
              <T th="ระบบเทรด" en="Trading Systems" />
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="post-list">
          {displayPosts.length > 0 ? (
            displayPosts.map((p) => (
              <Link key={p.slug} className="post-card" href={`/blog/${p.slug}`}>
                <div className="post-top">
                  <span className="ptag">
                    {p.tag === "Finance" ? <T th="การเงิน" en="Finance" /> : 
                     p.tag === "Psychology" ? <T th="จิตวิทยา" en="Psychology" /> : 
                     p.tag === "Trading Systems" ? <T th="ระบบเทรด" en="Trading Systems" /> : 
                     p.tag}
                  </span>
                  <span className="pmeta">
                    {p.dateShort} · <T th={`อ่าน ${p.minutes} นาที`} en={`${p.minutes} min read`} />
                  </span>
                </div>
                <h2>{p.title}</h2>
                <p className="excerpt">{p.excerpt}</p>
                <span className="more"><T th="อ่านต่อ →" en="Read more →" /></span>
              </Link>
            ))
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)' }}>
              <T th="ยังไม่มีบทความในหมวดหมู่นี้" en="No posts in this category yet" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
