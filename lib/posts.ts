// Blog post registry — drives the hub page, JSON-LD and the sitemap.
// Adding an article: copy an existing app/(site)/blog/<slug>/page.tsx,
// then add one entry here (hub card + sitemap update themselves).
export type Post = {
  slug: string;
  tag: string;
  title: string;
  description: string;
  excerpt: string;
  dateISO: string; // for JSON-LD / sitemap
  dateShort: string; // hub card, e.g. "23 มิ.ย. 2026"
  dateLong: string; // article header, e.g. "23 มิถุนายน 2026"
  minutes: number;
};

export const POSTS: Post[] = [
  {
    slug: "cot-gold-basics",
    tag: "Finance",
    title: "COT คืออะไร? วิธีอ่าน Commitment of Traders เทรดทองสำหรับมือใหม่",
    description:
      "เรียนรู้ COT (Commitment of Traders) report คืออะไร อ่านยังไง รู้จัก 3 กลุ่มผู้เล่นบน COMEX และใช้ตามรอยเงินรายใหญ่เพื่อเทรดทอง XAUUSD อย่างมีระบบ",
    excerpt:
      "รายงาน COT บอกว่าเงินรายใหญ่บน COMEX กำลังถือทองฝั่งไหน — เรียนรู้วิธีอ่าน 3 กลุ่มผู้เล่นหลัก และใช้มันยืนยันเทรนด์ทองคำ",
    dateISO: "2026-06-23",
    dateShort: "23 มิ.ย. 2026",
    dateLong: "23 มิถุนายน 2026",
    minutes: 6,
  },
  {
    slug: "trading-psychology-discipline",
    tag: "Psychology",
    title: "จิตวิทยาการเทรด: 5 กับดักทางใจที่ทำพอร์ตแตก และวิธีสร้างวินัย",
    description:
      "ทำไมระบบดีแต่ยังขาดทุน? เจาะ 5 กับดักจิตวิทยาการเทรด FOMO, Revenge trade, Overtrading และวิธีสร้างวินัยที่ทำซ้ำได้ เพราะระบบคือ 20% แต่จิตใจคือ 80%",
    excerpt:
      "ระบบคือ 20% แต่จิตใจคือ 80% — เจาะ 5 กับดักจิตวิทยาที่ทำเทรดเดอร์ล้างพอร์ต พร้อมวิธีสร้างวินัยที่ทำซ้ำได้ทุกวัน",
    dateISO: "2026-06-23",
    dateShort: "23 มิ.ย. 2026",
    dateLong: "23 มิถุนายน 2026",
    minutes: 7,
  },
  {
    slug: "ict-market-maker-basics",
    tag: "Trading Systems",
    title: "ICT / Market Maker Model เบื้องต้น: อ่านรอยเท้า Smart Money บนกราฟ",
    description:
      "ทำความรู้จัก ICT และ Market Maker Model — แนวคิด Liquidity, Order Block, Fair Value Gap (FVG) และวิธีมองกราฟแบบ Smart Money สำหรับเทรดเดอร์มือใหม่",
    excerpt:
      "Liquidity, Order Block, FVG — 3 แนวคิดหลักของ ICT ที่ช่วยให้คุณมองกราฟแบบ Smart Money และเข้าเทรดในจุดที่ได้เปรียบ",
    dateISO: "2026-06-23",
    dateShort: "23 มิ.ย. 2026",
    dateLong: "23 มิถุนายน 2026",
    minutes: 8,
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
