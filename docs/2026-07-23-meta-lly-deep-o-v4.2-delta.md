# META and LLY — DEEP+O v4.2 delta (Sections 2A, 7A, Retail Lights)

- MODE: FULL (web + code)
- Date: 2026-07-23 · Fiscal year covered: FY2025
- Scope: **v4.2 additions only.** Valuations, Quality scores, killers,
  catalysts and one-pagers stay as published on 2026-07-08 (META) and
  2026-07-10 (LLY). No DCF re-run — same reasoning as the AMZN delta: R5 fixes
  the narrative refresh to a quarterly cadence.
- Status: **awaiting review.**

## Source ladder

| Tier | Used for |
|---|---|
| Primary | segment and product revenue, segment operating income — META 10-K FY2025 (CIK 0001326801), LLY 10-K FY2025 (CIK 0000059478) |
| Primary | capex, free cash flow, net debt, operating cash flow, dividends — EDGAR companyfacts via `content/research/*.json` |

No fallback-tier sources were needed for either ticker.

---

# META

## Verified figures

Segment results FY2025 ($M, from the 10-K segment table):

| | Revenue | share | Operating income |
|---|---|---|---|
| Family of Apps | 198,759 | 98.9% | **+102,469** |
| Reality Labs | 2,207 | 1.1% | **−19,193** |
| **Total** | **200,966** | 100% | **83,276** |

The 10-K states it generates "substantially all" revenue from selling
advertising placements on the apps.

**Reality Labs has lost $53.0B over three years** (2023 −16,120 · 2024 −17,729 ·
2025 −19,193) against $6.2B of revenue in the same period. The 2025 loss alone
consumes **18.7%** of what Family of Apps earns.

From EDGAR: capex FY2025 $69.7B — **34.7% of revenue, up 87%** from $37.3B ·
free cash flow $46.1B, down 15% from $54.1B · net debt $22.9B against $115.8B
operating cash flow (0.20 years) · dividend started 2024, $2.00 → $2.10,
payout 8.8%.

## Retail Lights Reconciliation

| Light | Result | Basis |
|---|---|---|
| รายได้ | **ดี** | grew 3 of 3 — +16%, +22%, +22% |
| กำไรสุทธิ | **ดี** | grew 2 of 3 (2025 −3%) |
| กระแสเงินสด | **ดี** | positive all three years, latest down 15% — inside the 40% band |
| หนี้สิน | **ดี** | 0.20 years of operating cash flow |

**Does Quality 86 contradict the lights?** No — all four read good, and 86 sits
in the "high" band. The tension the report identifies is not in the trailing
figures at all: it is capex at 34.7% of revenue whose depreciation has not yet
reached the income statement. That is a forward risk, which is why it appears
under `businessRisks` rather than as a light.

## Section 2A — Business Profile

```ts
business: {
  whatItDoes: {
    th: "Meta เป็นเจ้าของ Facebook, Instagram, WhatsApp และ Messenger รายได้เกือบทั้งหมดมาจากการขายพื้นที่โฆษณาบนแอปเหล่านี้ ผู้ใช้ไม่ต้องจ่ายเงิน แต่ผู้ลงโฆษณาจ่ายเพื่อเข้าถึงผู้ใช้ อีกส่วนคือธุรกิจแว่น VR ที่ยังขาดทุนอยู่",
    en: "Meta owns Facebook, Instagram, WhatsApp and Messenger, and earns almost all of its money selling advertising space across them. Users pay nothing; advertisers pay to reach them. A separate VR arm still loses money.",
  },
  revenueMix: [
    { label: { th: "แอปทั้งสี่ (เกือบทั้งหมดเป็นค่าโฆษณา)", en: "The four apps (nearly all advertising)" }, sharePct: 99 },
    { label: { th: "Reality Labs (แว่น VR/AR)", en: "Reality Labs (VR/AR)" }, sharePct: 1 },
  ],
  moat: {
    th: "คนใช้ Facebook และ Instagram เพราะเพื่อนอยู่ที่นั่น ยิ่งมีคนใช้มากยิ่งย้ายออกยาก คู่แข่งหน้าใหม่ต้องดึงคนทั้งกลุ่มไปพร้อมกัน ไม่ใช่ทีละคน",
    en: "People use Facebook and Instagram because their friends are there, and the more who stay the harder leaving becomes. A newcomer has to move a whole circle at once, not one person at a time.",
  },
  moatStrength: "wide",
  strengths: [
    { th: "ธุรกิจแอปทำกำไรจากการดำเนินงาน 102 พันล้านในปีเดียว", en: "The apps business earned $102B of operating income in one year." },
    { th: "รายได้โต 22% สองปีติด ทั้งที่ฐานใหญ่ระดับ 2 แสนล้าน", en: "Revenue grew 22% two years running, on a $200B base." },
    { th: "หนี้น้อยมาก คิดเป็นกระแสเงินสดเพียง 0.2 ปี", en: "Debt is small — just 0.2 years of operating cash flow." },
  ],
  weaknesses: [
    { th: "Reality Labs ขาดทุนรวม 53 พันล้านใน 3 ปี รายได้รวมแค่ 6.2 พันล้าน", en: "Reality Labs lost $53B over three years on $6.2B of revenue." },
    { th: "เงินลงทุนปี 2025 พุ่งเป็น 35% ของรายได้ จาก 23% ปีก่อน", en: "Capital spending jumped to 35% of revenue in 2025, from 23%." },
    { th: "รายได้เกือบทั้งหมดมาจากแหล่งเดียวคือค่าโฆษณา", en: "Nearly all revenue comes from one source: advertising." },
  ],
  competitors: ["Google (YouTube)", "TikTok", "Snap", "Amazon"],
},
```

## Section 7A — Business Risks

```ts
businessRisks: [
  {
    risk: { th: "รายได้เกือบทั้งหมดมาจากค่าโฆษณา", en: "Nearly all revenue is advertising" },
    why: {
      th: "แอปทั้งสี่คิดเป็น 99% ของรายได้ และเกือบทั้งหมดเป็นค่าโฆษณา เมื่อเศรษฐกิจชะลอ ผู้ลงโฆษณามักตัดงบก่อนเป็นอย่างแรก และบริษัทไม่มีรายได้ทางอื่นมารองรับ",
      en: "The apps are 99% of revenue and almost all of it is advertising. Advertisers cut budgets first in a slowdown, and there is no second stream to absorb it.",
    },
    kind: "concentration",
  },
  {
    risk: { th: "ธุรกิจ VR ขาดทุนต่อเนื่องโดยรายได้ยังไม่ขยับ", en: "The VR arm keeps losing money with no revenue to show" },
    why: {
      th: "Reality Labs ขาดทุนรวม 53 พันล้านในสามปี ขณะที่รายได้รวมสามปีอยู่ที่ 6.2 พันล้าน การขาดทุนปี 2025 กินกำไรของธุรกิจแอปไป 18.7%",
      en: "Reality Labs lost $53B over three years while taking in $6.2B. The 2025 loss alone consumed 18.7% of what the apps earned.",
    },
    kind: "execution",
  },
  {
    risk: { th: "เงินลงทุนพุ่งเร็วกว่าที่รายได้จะตามทัน", en: "Investment is rising faster than revenue can follow" },
    why: {
      th: "ปี 2025 ใช้เงินลงทุน 69.7 พันล้าน หรือ 35% ของรายได้ เพิ่มจากปีก่อน 87% ค่าเสื่อมราคาจากศูนย์ข้อมูลเหล่านี้จะทยอยกดกำไรในปีถัด ๆ ไป ไม่ว่ารายได้จะโตทันหรือไม่",
      en: "2025 capital spending reached $69.7B, or 35% of revenue, up 87% in a year. Depreciation on those data centres will press on profit in later years whether or not revenue keeps pace.",
    },
    kind: "financial",
  },
  {
    risk: { th: "กฎระเบียบอาจจำกัดการใช้ข้อมูลผู้ใช้เพื่อยิงโฆษณา", en: "Rules may limit using personal data to target ads" },
    why: {
      th: "การยิงโฆษณาแบบเจาะกลุ่มคือสิ่งที่ทำให้ขายพื้นที่โฆษณาได้ราคาสูง ถ้าถูกจำกัดในตลาดใหญ่ ราคาต่อโฆษณาหนึ่งชิ้นจะลดลงแม้จำนวนผู้ใช้เท่าเดิม",
      en: "Targeting is what makes the ad space expensive. Restrict it in a large market and the price per ad falls even with the same number of users.",
    },
    kind: "regulation",
  },
],
```

---

# LLY

## Verified figures

Revenue by product FY2025 ($M, from the 10-K):

| | FY2025 | share | YoY |
|---|---|---|---|
| Mounjaro | 22,965 | 35.2% | **+99%** |
| Zepbound | 13,542 | 20.8% | **+175%** |
| Verzenio | 5,723 | 8.8% | +8% |
| Other products | 22,949 | 35.2% | — |
| **Total** | **65,179** | 100% | **+45%** |

**Mounjaro and Zepbound are the same molecule.** The 10-K footnote states
tirzepatide is marketed for obesity as Zepbound and for diabetes as Mounjaro.
Together they are **$36.5B, or 56.0% of the entire company's revenue** — a
concentration a product chart hides from anyone who does not know the two
brands share a compound.

From EDGAR: capex FY2025 $7.8B (12.0% of revenue, up from $1.3B in 2021) ·
free cash flow $9.0B, recovering from $0.8B in 2023 · net debt $35.1B against
$16.8B operating cash flow — **2.09 years** · dividend paid all five years,
$3.53 → $6.23, payout 26.1%.

## Retail Lights Reconciliation

| Light | Result | Basis |
|---|---|---|
| รายได้ | **ดี** | grew 3 of 3 — +20%, +32%, +45% |
| กำไรสุทธิ | **ดี** | grew 2 of 3 (2023 −16%) |
| กระแสเงินสด | **ดี** | positive all three years and rising |
| หนี้สิน | **เฝ้าระวัง** | net debt is 2.09 years of operating cash flow, just over the 2-year line |

**Does Quality 91 contradict the debt light?** It sits right on the boundary and
needs saying plainly. Lilly is borrowing to build manufacturing capacity for the
incretin ramp while revenue grows 45% a year; leverage at 2.09 years is a
build-cycle figure, not distress. But the light is correct to flag it, and the
reason belongs in front of the reader — so it appears in `weaknesses` and as
the `financial` risk below.

## Section 2A — Business Profile

```ts
business: {
  whatItDoes: {
    th: "Eli Lilly คือบริษัทยาที่คิดค้นและผลิตยารักษาโรค รายได้กว่าครึ่งมาจากยาตัวเดียวคือ tirzepatide ซึ่งขายภายใต้สองชื่อ — Mounjaro สำหรับเบาหวาน และ Zepbound สำหรับลดน้ำหนัก ที่เหลือเป็นยามะเร็ง ยาเบาหวานรุ่นเก่า และยากลุ่มอื่น",
    en: "Eli Lilly discovers and manufactures medicines. More than half its revenue comes from a single molecule, tirzepatide, sold under two names — Mounjaro for diabetes and Zepbound for weight loss. The rest is cancer drugs, older diabetes treatments and other categories.",
  },
  revenueMix: [
    { label: { th: "Mounjaro (เบาหวาน)", en: "Mounjaro (diabetes)" }, sharePct: 35 },
    { label: { th: "Zepbound (ลดน้ำหนัก — ยาตัวเดียวกับ Mounjaro)", en: "Zepbound (weight loss — same molecule as Mounjaro)" }, sharePct: 21 },
    { label: { th: "Verzenio (มะเร็งเต้านม)", en: "Verzenio (breast cancer)" }, sharePct: 9 },
    { label: { th: "ยาอื่น ๆ", en: "Other medicines" }, sharePct: 35 },
  ],
  moat: {
    th: "สิทธิบัตรยาทำให้ห้ามใครผลิตเลียนแบบได้จนกว่าจะหมดอายุ และการผลิตยาฉีดกลุ่มนี้ต้องใช้โรงงานเฉพาะทางที่สร้างใหม่ใช้เวลาหลายปี คู่แข่งจึงเพิ่มกำลังผลิตตามไม่ทันแม้จะมียาที่ใกล้เคียงกัน",
    en: "Patents bar copies until they expire, and making these injectables needs specialised plants that take years to build — so rivals cannot add capacity quickly even with a similar drug.",
  },
  moatStrength: "wide",
  strengths: [
    { th: "รายได้โต 45% ในปี 2025 ทั้งที่ฐานรายได้เกิน 4 หมื่นล้าน", en: "Revenue grew 45% in 2025 on a base above $45B." },
    { th: "Zepbound โต 175% และ Mounjaro โต 99% ในปีเดียว", en: "Zepbound grew 175% and Mounjaro 99% in a single year." },
    { th: "จ่ายปันผลต่อเนื่อง 5 ปี เพิ่มจาก 3.53 เป็น 6.23 ดอลลาร์ต่อหุ้น", en: "Five straight years of dividends, rising from $3.53 to $6.23 a share." },
  ],
  weaknesses: [
    { th: "รายได้ 56% มาจากยาตัวเดียว แม้จะขายภายใต้สองชื่อ", en: "56% of revenue comes from one molecule, despite two brand names." },
    { th: "หนี้สุทธิเท่ากับกระแสเงินสด 2.1 ปี จากการเร่งสร้างโรงงาน", en: "Net debt equals 2.1 years of cash flow, from the factory build-out." },
    { th: "บริษัทระบุเองว่าราคาขายจริงต่อหน่วยกำลังลดลง", en: "The company states its realised price per unit is falling." },
  ],
  competitors: ["Novo Nordisk", "Pfizer", "AstraZeneca", "Merck"],
},
```

## Section 7A — Business Risks

```ts
businessRisks: [
  {
    risk: { th: "รายได้กว่าครึ่งมาจากยาตัวเดียว", en: "One molecule brings in over half the revenue" },
    why: {
      th: "Mounjaro กับ Zepbound เป็นยาตัวเดียวกันคนละชื่อ รวมกัน 56% ของรายได้ทั้งบริษัท ปัญหาใด ๆ กับยาตัวนี้ ไม่ว่าจะเรื่องความปลอดภัย การผลิต หรือราคา กระทบครึ่งบริษัทพร้อมกัน",
      en: "Mounjaro and Zepbound are the same drug under two names, together 56% of company revenue. Any problem with it — safety, manufacturing or price — hits half the company at once.",
    },
    kind: "concentration",
  },
  {
    risk: { th: "ราคาขายจริงต่อหน่วยกำลังลดลง", en: "The realised price per unit is falling" },
    why: {
      th: "บริษัทระบุในรายงานประจำปีว่ายอดขายโตจากปริมาณ แต่ราคาที่ได้รับจริงลดลง หากปริมาณหยุดโตเมื่อไร รายได้จะชะลอเร็วกว่าที่ตัวเลขการเติบโตปีนี้บอก",
      en: "The annual report says growth came from volume while realised prices fell. If volume stops rising, revenue slows faster than this year's growth rate suggests.",
    },
    kind: "competition",
  },
  {
    risk: { th: "หนี้เพิ่มขึ้นจากการเร่งสร้างโรงงาน", en: "Debt is rising to fund the factory build-out" },
    why: {
      th: "หนี้สุทธิ 35.1 พันล้าน เทียบเท่ากระแสเงินสดจากการดำเนินงาน 2.1 ปี ซึ่งเกินเกณฑ์ที่ระบบนับว่าปลอดภัย การลงทุนนี้จะคุ้มก็ต่อเมื่อความต้องการยายังโตตามที่คาด",
      en: "Net debt of $35.1B equals 2.1 years of operating cash flow, past the line this system treats as comfortable. The spending pays off only if demand keeps growing as expected.",
    },
    kind: "financial",
  },
  {
    risk: { th: "นโยบายราคายาของรัฐอาจกดราคาลงอีก", en: "Government drug-pricing policy could push prices down further" },
    why: {
      th: "ยากลุ่มนี้มีผู้ใช้จำนวนมากและค่าใช้จ่ายรวมสูง จึงเป็นเป้าของการเจรจาราคาโดยรัฐ ซึ่งกระทบรายได้ต่อหน่วยโดยที่จำนวนคนไข้ไม่ลดลง",
      en: "These drugs have many users and a large total cost, which makes them a target for government price negotiation — cutting revenue per patient without cutting patient numbers.",
    },
    kind: "regulation",
  },
],
```

---

## Review checklist

- [ ] META: segment figures sum to 200,966 · RL three-year loss $53.0B
- [ ] LLY: product figures sum to 65,179 · tirzepatide combined 56.0%
- [ ] No buy / sell / hold / wait wording; nothing addressed to the reader
- [ ] Four risks each, four different `kind` values
- [ ] Both `revenueMix` sets sum within 100 ± 2 (META 100, LLY 100)
- [ ] LLY's debt light is explained where the reader sees it

## Sources

- [META Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1326801/000162828026003942/meta-20251231.htm) — segment revenue and operating income
- [LLY Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/59478/000005947826000013/lly-20251231.htm) — revenue by product, tirzepatide brand footnote
- [EDGAR companyfacts CIK 0001326801](https://data.sec.gov/api/xbrl/companyfacts/CIK0001326801.json) · [CIK 0000059478](https://data.sec.gov/api/xbrl/companyfacts/CIK0000059478.json)
