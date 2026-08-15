import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "./JsonLd";
import type { Post } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

// Shared shell for blog articles: breadcrumb + head + body + product CTA.
// Metadata and JSON-LD derive from the post registry so head tags never
// drift from the visible content.

export function articleMetadata(post: Post): Metadata {
  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} | Cerfinits`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      siteName: "Cerfinits",
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
      locale: "th_TH",
      publishedTime: post.dateISO,
      images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, images: ["/og-cover.png"] },
  };
}

export default function ArticleShell({
  post,
  cta,
  children,
}: {
  post: Post;
  cta: { title: React.ReactNode; text: React.ReactNode; related: React.ReactNode };
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '0 clamp(20px, 5vw, 64px)' }}>
      <article className="article-wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          image: `${SITE_URL}/og-cover.png`,
          datePublished: post.dateISO,
          dateModified: post.dateISO,
          author: { "@type": "Person", name: "Kan — Cerfinits" },
          publisher: {
            "@type": "Organization",
            name: "Cerfinits",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/og-cover.png` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
        }}
      />

      <div className="breadcrumb">
        <Link href="/blog">บทความ</Link> / {post.tag}
      </div>

      <header className="article-head">
        <span className="eyebrow">{post.tag}</span>
        <h1>{post.title}</h1>
        <div className="article-meta">
          <span>{post.dateLong}</span>
          <span>อ่าน {post.minutes} นาที</span>
          <span>โดย Kan — Cerfinits</span>
        </div>
      </header>

      <div className="article-body">
        {children}
        <p className="disclaimer">
          บทความนี้จัดทำเพื่อให้ความรู้เท่านั้น ไม่ใช่คำแนะนำการลงทุน การเทรดมีความเสี่ยง
          ผู้อ่านควรศึกษาและตัดสินใจด้วยตนเอง
        </p>
      </div>

      <div className="cta-box">
        <div className="ce">อ่านต่อแบบเจาะลึก</div>
        <h3>{cta.title}</h3>
        <p>{cta.text}</p>
        <div className="related">{cta.related}</div>
      </div>
    </article>
    </div>
  );
}
