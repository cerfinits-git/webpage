# AMZN — DEEP+O v4.2 delta (Sections 2A, 7A, Retail Lights)

- MODE: FULL (web + code)
- Date: 2026-07-23 · Ticker: AMZN · Fiscal year covered: FY2025
- Scope: **the v4.2 additions only.** The valuation, Quality score, killers,
  catalysts and one-pager stay as published in the v4 report of 2026-07-10
  (E[V] $184.71, Quality 80, trigger $148). No DCF was re-run — R5 fixes the
  narrative refresh to a quarterly cadence, and a second E[V] issued thirteen
  days after the first would contradict the published PDF without new filings
  to justify it.
- Status: **awaiting review.** Nothing here reaches the site until signed off.

## Source ladder

| Tier | Used for | Source |
|---|---|---|
| Primary | revenue by type, segment sales, segment operating income | AMZN 10-K FY2025 (CIK 0001018724) + Q4 2025 earnings release |
| Primary | capex, free cash flow, net debt, operating cash flow | SEC EDGAR XBRL companyfacts → `content/research/amzn.json` |
| Fallback ⚠️ | cloud market share and rival growth rates | third-party trackers (Statista / Synergy-derived); directionally consistent across sources but not a filing |

## Verified figures

Net sales by type, FY2025 ($M, from the 10-K disaggregation table):

| | FY2023 | FY2024 | FY2025 | share | YoY |
|---|---|---|---|---|---|
| Online stores | 231,872 | 247,029 | 269,287 | 37.6% | +9.0% |
| Third-party seller services | 140,053 | 156,146 | 172,162 | 24.0% | +10.3% |
| AWS | 90,757 | 107,556 | 128,725 | 18.0% | +19.7% |
| Advertising services | 46,906 | 56,214 | 68,635 | 9.6% | +22.1% |
| Subscription services | 40,209 | 44,374 | 49,619 | 6.9% | +11.8% |
| Physical stores | 20,030 | 21,215 | 22,561 | 3.1% | +6.3% |
| Other | 4,958 | 5,425 | 5,935 | 0.8% | +9.4% |
| **Consolidated** | **574,785** | **637,959** | **716,924** | 100% | +12.4% |

Segment operating income FY2025: AWS $45.6B · North America $29.6B ·
International $4.7B → total $79.9B.

**The number that reframes the company: AWS is 18.0% of sales and 57.1% of
operating profit.** The retail business — 82% of revenue — earns a 5.8%
operating margin ($34.3B on $588.2B).

From EDGAR: capex FY2025 $131.8B (18.4% of revenue) · free cash flow $7.7B,
down 76.6% from $32.9B · net debt −$18.4B (more cash than debt) · operating
cash flow $139.5B.

## Retail Lights Reconciliation (new in v4.2)

Computed with the thresholds in `lib/research/dashboard.ts`:

| Light | Result | Basis |
|---|---|---|
| รายได้ | **ดี** | grew in 3 of 3 years — 2023 +12%, 2024 +11%, 2025 +12% |
| กำไรสุทธิ | **ดี** | grew in 3 of 3 years |
| กระแสเงินสด | **เฝ้าระวัง** | positive all three years, but the latest fell 77% |
| หนี้สิน | **ดี** | net cash: −$18.4B against $139.5B operating cash flow |

**Does Quality 80 contradict the lights?** No. Three read good and one reads
watch, and the watch is the capex cycle the report's own One Question is about —
consistent with a score at the low end of the "high" band rather than the top of
it. Per the v4.2 rule the explanation must reach the reader, so the cash-flow
squeeze appears in `weaknesses` and again as the `execution` risk below, not
only in this report.

## Section 2A — Business Profile

```ts
business: {
  whatItDoes: {
    th: "Amazon ขายสินค้าออนไลน์ เก็บค่าบริการจากร้านค้าอื่นที่มาขายบนเว็บของตัวเอง และให้เช่าเซิร์ฟเวอร์กับบริษัททั่วโลกภายใต้ชื่อ AWS รายได้ส่วนใหญ่มาจากการค้าปลีก แต่กำไรส่วนใหญ่มาจากการให้เช่าเซิร์ฟเวอร์",
    en: "Amazon sells goods online, charges other merchants to sell on its site, and rents computing power to companies worldwide as AWS. Most of its revenue comes from retail; most of its profit comes from renting servers.",
  },
  revenueMix: [
    { label: { th: "ขายของออนไลน์เอง", en: "Own online stores" }, sharePct: 38 },
    { label: { th: "ค่าบริการจากผู้ขายรายอื่น", en: "Third-party seller services" }, sharePct: 24 },
    { label: { th: "AWS (ให้เช่าเซิร์ฟเวอร์)", en: "AWS (cloud computing)" }, sharePct: 18 },
    { label: { th: "โฆษณา", en: "Advertising" }, sharePct: 10 },
    { label: { th: "ค่าสมาชิกและอื่น ๆ", en: "Subscriptions and other" }, sharePct: 11 },
  ],
  moat: {
    th: "คลังสินค้าและระบบขนส่งที่ใช้เงินหลายสิบปีสร้าง ทำให้ส่งของได้เร็วในราคาที่คู่แข่งรายใหม่สู้ไม่ไหว ส่วน AWS ย้ายออกยากเพราะระบบของลูกค้าถูกเขียนผูกกับเครื่องมือของ Amazon ไปแล้ว",
    en: "A delivery network built over decades lets it ship faster and cheaper than a newcomer can match, and AWS customers are hard to move because their systems are written around Amazon's tools.",
  },
  moatStrength: "wide",
  strengths: [
    { th: "AWS เป็นรายได้เพียง 18% แต่สร้างกำไร 57% ของทั้งบริษัท", en: "AWS is 18% of sales but 57% of operating profit." },
    { th: "โฆษณาโต 22% ในปี 2025 และเป็นรายได้ที่แทบไม่ต้องลงทุนเพิ่ม", en: "Advertising grew 22% in 2025 and needs almost no extra investment." },
    { th: "มีเงินสดมากกว่าหนี้ แม้อยู่ในรอบลงทุนหนักที่สุดของบริษัท", en: "It holds more cash than debt even in its heaviest investment cycle." },
  ],
  weaknesses: [
    { th: "ธุรกิจค้าปลีก 82% ของรายได้ ทำกำไรได้บางมากที่ 5.8%", en: "Retail is 82% of revenue but earns a thin 5.8% margin." },
    { th: "เงินสดอิสระปี 2025 เหลือ 7.7 พันล้าน ลดจากปีก่อน 77%", en: "Free cash flow fell 77% in 2025, to $7.7B." },
    { th: "ส่วนแบ่งคลาวด์ยังนำ แต่โตช้ากว่าคู่แข่งสองรายหลัก", en: "It still leads cloud share but grows slower than its two main rivals." },
  ],
  competitors: ["Microsoft (Azure)", "Google (Cloud)", "Walmart", "Alibaba"],
},
```

## Section 7A — Business Risks

Four risks, four distinct `kind` values as v4.2 requires.

```ts
businessRisks: [
  {
    risk: { th: "กำไรเกินครึ่งมาจาก AWS ธุรกิจเดียว", en: "More than half the profit comes from AWS alone" },
    why: { th: "AWS เป็นรายได้แค่ 18% แต่เป็นกำไร 57% ถ้าธุรกิจนี้สะดุด กำไรทั้งบริษัทสะเทือนทันทีแม้ยอดขายรวมยังโต", en: "AWS is 18% of sales but 57% of profit, so a stumble there hits company profit at once even while total sales still grow." },
    kind: "concentration",
  },
  {
    risk: { th: "เงินลงทุนก้อนใหญ่ยังไม่กลายเป็นเงินสด", en: "The large investment has not turned into cash yet" },
    why: { th: "ปี 2025 ใช้เงินลงทุน 131.8 พันล้าน คิดเป็น 18% ของรายได้ ทำให้เงินสดอิสระเหลือ 7.7 พันล้าน จาก 32.9 พันล้านปีก่อน", en: "2025 capital spending of $131.8B — 18% of revenue — cut free cash flow to $7.7B from $32.9B." },
    kind: "execution",
  },
  {
    risk: { th: "คลาวด์คู่แข่งโตเร็วกว่า", en: "Rival clouds are growing faster" },
    why: { th: "AWS ยังมีส่วนแบ่งมากที่สุด แต่เติบโตราว 20% ต่อปี ขณะที่คู่แข่งรายใหญ่สองรายโตเร็วกว่านั้นชัดเจน ⚠️ ตัวเลขส่วนแบ่งมาจากผู้รวบรวมภายนอก ไม่ใช่งบบริษัท", en: "AWS still holds the largest share but grows around 20% a year while its two largest rivals grow visibly faster. Share figures come from third-party trackers, not filings." },
    kind: "competition",
  },
  {
    risk: { th: "รายได้ 82% ผูกกับกำลังซื้อของผู้บริโภค", en: "82% of revenue depends on consumer spending" },
    why: { th: "ธุรกิจค้าปลีกทำกำไรบางอยู่แล้วที่ 5.8% เมื่อคนใช้จ่ายน้อยลง กำไรส่วนนี้หายได้เร็วกว่ายอดขายที่ลดลง", en: "Retail already runs on a thin 5.8% margin, so its profit falls faster than its sales when households spend less." },
    kind: "cyclical",
  },
],
```

## Review checklist before publishing

- [ ] Every percentage above traces to the 10-K table or `content/research/amzn.json`
- [ ] No buy / sell / hold / wait wording, and nothing addressed to the reader
- [ ] The cloud-share claim keeps its ⚠️ fallback-source marker
- [ ] `revenueMix` shares sum within 100 ± 2 (they sum to 101)
- [ ] Four risks, four different `kind` values

## Sources

- [Amazon Q4 and full year 2025 results](https://www.aboutamazon.com/news/company-news/amazon-earnings-q4-2025-report) — segment sales and segment operating income
- [AMZN Form 10-K FY2025](https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm) — net sales disaggregated by type of product or service
- [SEC EDGAR XBRL companyfacts, CIK 0001018724](https://data.sec.gov/api/xbrl/companyfacts/CIK0001018724.json) — capex, free cash flow, net debt, operating cash flow
- ⚠️ [Statista — worldwide cloud infrastructure market share](https://www.statista.com/chart/18819/worldwide-market-share-of-leading-cloud-infrastructure-service-providers/) — third-party, fallback tier
