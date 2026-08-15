/**
 * Facts the privacy notice is legally required to state (PDPA s.23) and that
 * only Kan can supply. Kept here so the notice, the contact links and any
 * future terms page cannot drift apart, and so the pieces that must be filled
 * in before launch are in one place instead of buried in prose.
 *
 * Cerfinits is not a registered company, so the data controller is Kan as a
 * natural person. That means the notice has to carry a real name — a brand
 * name alone does not identify a controller.
 */
export const CONTROLLER = {
  /**
   * Legal name in Thai, exactly as it appears on the national ID card.
   * TODO(kan): fill this in before the notice goes live — the transliteration
   * of a name is not something to guess, and a notice naming the wrong person
   * identifies no controller at all.
   */
  nameTh: "",
  nameEn: "Narabodin Seesanok",
  /** Brand the site trades under. Not a legal entity. */
  brand: "Cerfinits",
  status: "บุคคลธรรมดา (ยังไม่ได้จดทะเบียนนิติบุคคล)",
  /** Where data-subject requests go. Confirm before launch. */
  email: "narabodin09ask@gmail.com",
} as const;

/** The notice must not claim a controller it cannot name. */
export function controllerName() {
  return CONTROLLER.nameTh || CONTROLLER.nameEn;
}

/** Where personal data physically sits, which s.28 requires disclosing. */
export const PROCESSORS = [
  {
    name: "Supabase",
    role: "ฐานข้อมูลและระบบยืนยันตัวตน",
    location: "โซล ประเทศเกาหลีใต้ (AWS ap-northeast-2)",
  },
  {
    name: "Netlify",
    role: "โฮสต์เว็บไซต์และบันทึกการเข้าถึงของเซิร์ฟเวอร์",
    location: "สหรัฐอเมริกาและเครือข่ายทั่วโลก",
  },
  {
    name: "Google",
    role: "การเข้าสู่ระบบด้วยบัญชี Google (OAuth)",
    location: "สหรัฐอเมริกา",
  },
  {
    name: "cTrader (Spotware)",
    role: "ดึงประวัติการเทรด เมื่อผู้ใช้เชื่อมบัญชีเอง",
    location: "สหภาพยุโรป",
  },
] as const;

/** Version stamps shown on each document. Bump when the substance changes. */
export const PRIVACY_UPDATED = "14 สิงหาคม 2569";
export const TERMS_UPDATED = "14 สิงหาคม 2569";

/**
 * Which wording a subscriber agreed to, stored with their row.
 *
 * PDPA s.19 puts the burden of proving consent on the controller, and "they
 * ticked a box" is not proof unless we can say which box. Bump this whenever
 * the consent sentence or the purposes behind it change, so a later dispute
 * can be answered with the text that was actually on screen.
 */
export const CONSENT_VERSION = "2026-08-14";

/** Purposes the consent covers. Shown verbatim next to the checkbox. */
export const CONSENT_PURPOSES = [
  "ส่งบทเรียนใหม่ งานวิจัย และของแจกฟรีทางอีเมล",
  "นับว่าช่องทางไหนมีคนสนใจ เพื่อตัดสินใจว่าจะทำอะไรต่อ",
] as const;

/**
 * What is actually on sale, and through whom. Written from the site as it
 * stands: nothing is paid for on cerfinits itself — e-books check out on
 * Gumroad and the Algo licence is arranged over Discord — so the terms must
 * not describe a checkout that does not exist.
 */
export const OFFERINGS = [
  {
    name: "เนื้อหาที่เปิดอ่านฟรี",
    detail: "บทความ · หลักสูตร Cerfinits Grade ระดับ 1–4 · แบบทดสอบเทรดเดอร์ · บทวิเคราะห์หุ้น",
    payment: "ไม่มีค่าใช้จ่าย บางส่วนต้องเข้าสู่ระบบ",
  },
  {
    name: "หนังสือ E-book",
    detail: "ไฟล์ดิจิทัล ส่งมอบทันทีหลังชำระเงิน",
    payment: "ชำระเงินและส่งมอบผ่าน Gumroad ซึ่งมีเงื่อนไขของตนเอง",
  },
  {
    name: "Cerfinits Algo SDV.1",
    detail: "License รายเดือน สำหรับบัญชีเทรดจริง 1 บัญชี",
    payment: "ติดต่อและชำระเงินผ่าน Discord ไม่มีระบบตัดเงินอัตโนมัติ",
  },
  {
    name: "Cerfinits Grade ระดับ 5–8",
    detail: "ยังไม่เปิดจำหน่าย",
    payment: "ยังไม่มีช่องทางชำระเงิน",
  },
] as const;
