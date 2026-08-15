// Stock research registry — drives /research hub + detail pages + sitemap.
//
// Reports are hand-authored content: Kan runs the DEEP+O analyst framework in his
// own session, then drops the structured result here. The web app NEVER calls an
// LLM — zero API cost, zero abuse surface. Live prices come from Yahoo at render
// time (lib/quotes.ts); everything else is the analyst's frozen snapshot.
//
// Add a stock: copy the META entry, replace with your DEEP+O output, commit, deploy.

export type Verdict = "buy" | "accumulate" | "hold" | "trim" | "sell";
export type Uncertainty = "LOW" | "MED" | "HIGH";

export type Translatable = { th: string; en: string };

/**
 * Section 2A of a v4.2 report — the reasoning behind the D and E components of
 * the Quality score, written for a reader with no accounting background rather
 * than collapsed into a number. Feeds module 2 of the retail dashboard.
 */
export type BusinessProfile = {
  whatItDoes: Translatable;
  /** From 10-K segment reporting. Whole percents, summing to 100 ± 2. */
  revenueMix: { label: Translatable; sharePct: number }[];
  moat: Translatable;
  moatStrength: "wide" | "narrow" | "none";
  strengths: Translatable[];
  weaknesses: Translatable[];
  competitors: string[];
};

/**
 * Section 7A — the Risk Map in plain language. Distinct from `killers`, which
 * are position-exit triggers written with metrics and thresholds for someone
 * already holding. Feeds module 7.
 */
export type BusinessRisk = {
  risk: Translatable;
  why: Translatable;
  kind:
    | "concentration"
    | "regulation"
    | "competition"
    | "execution"
    | "cyclical"
    | "financial";
};

export type StockReport = {
  ticker: string; // Yahoo symbol, uppercase — also the URL slug (/research/META)
  company: string;
  exchange: string; // display only, e.g. "NASDAQ"
  asOf: string; // ISO date the report reflects, e.g. "2026-07-08"
  refPrice: number; // price the report was written against (USD)

  verdict: Verdict;
  verdictEmoji: string; // 🟢 / 🟡 / 🔴
  verdictLabel: Translatable; 
  quality: number; // DEEP+O Quality Score /100
  confidence: number; // /5
  uncertainty: Uncertainty;

  oneQuestion: Translatable; // the single economic question that decides the stock
  thesisOneSentence: Translatable;

  // v4.2 retail sections. Optional so reports written before v4.2 keep working;
  // the dashboard shows a pending state where they are absent.
  business?: BusinessProfile;
  businessRisks?: BusinessRisk[];

  valuation: {
    bear: number;
    base: number;
    bull: number;
    ev: number; // probability-weighted E[V] — the number that drives the verdict
    bearP: number; // scenario probabilities (0-1), used for the football-field labels
    baseP: number;
    bullP: number;
    trigger: number; // price at/below which the verdict flips to accumulate
    verdictWord: Translatable; 
  };

  variant: {
    market: Translatable; // what the market believes (read from evidence)
    us: Translatable; // where the analyst differs, with the variable + value
  };

  killers: Translatable[]; // thesis killers — observable, with metric + threshold
  catalysts: { when: Translatable; what: Translatable }[];
  returnMath: { floorPct: string; onTrackPct: string; note: Translatable };

  // Section G — 2-axis sensitivity grid (the two variables the One Question hangs on).
  // Cells are scenario valuations; colored green/red vs the live price, base cell boxed.
  sensitivity?: {
    rowLabel: Translatable;
    colLabel: Translatable;
    rows: string[]; // top → bottom
    cols: string[]; // left → right
    grid: number[][]; // grid[row][col] = valuation (USD)
    baseRow: number; // index into rows
    baseCol: number; // index into cols
    caption: Translatable;
  };

  onePager: Translatable; // plain-prose summary (Section 13) — the readable body

  sources: { label: string; url: string }[];

  // Optional full DEEP+O PDF (drop it in public/reports/). When set, the detail
  // page offers a direct download; otherwise it falls back to browser print.
  pdfUrl?: string;
};

export const REPORTS: StockReport[] = [
  {
    ticker: "AAPL",
    company: "Apple Inc.",
    exchange: "NASDAQ",
    asOf: "2026-07-24",
    refPrice: 320.83,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ ห้ามเพิ่ม", en: "Hold / No Add" },
    quality: 88,
    confidence: 3,
    uncertainty: "MED",

    oneQuestion: {
      th: "ตลาดจ่ายราว 48 เท่าของกระแสเงินสดอิสระให้ Apple — ส่วนเกินนี้คือพรีเมียมคุณภาพที่ยั่งยืน หรือความเสี่ยงที่ราคาจะกลับสู่มูลค่าพื้นฐาน? พูดเป็นตัวแปรเดียว: ธุรกิจ Services จะโตและรักษาอัตรากำไรขั้นต้น 75% ได้นานพอที่จะ justify ตัวคูณระดับนี้หรือไม่",
      en: "The market pays about 48x free cash flow for Apple — is that excess a durable quality premium or mean-reversion risk? In one variable: can Services keep growing while holding a 75% gross margin long enough to justify the multiple?",
    },
    thesisOneSentence: {
      th: "Apple คือธุรกิจคุณภาพสูงที่สุดกลุ่มหนึ่งของโลก แต่ราคาปัจจุบันจ่ายพรีเมียมเหนือมูลค่าที่แบบจำลองกระแสเงินสดใด ๆ ประเมินได้ราว 2.6 เท่า — เดิมพันอยู่ที่ว่าพรีเมียมคุณภาพนี้จะคงอยู่ หรือกลับสู่พื้นฐาน",
      en: "Apple is one of the world's highest-quality businesses, but today's price pays roughly 2.6x what any cash-flow model can justify — the bet is whether that quality premium persists or reverts.",
    },

    // v4.2 Section 2A/7A — reviewed 2026-07-24.
    // Revenue mix and gross margin from the FY2025 10-K; balance-sheet figures
    // from the EDGAR snapshot. Working paper:
    // docs/2026-07-24-aapl-deep-o-v4.2-working-paper.md
    business: {
      whatItDoes: {
        th: "Apple ขายฮาร์ดแวร์ — iPhone คิดเป็นครึ่งหนึ่งของรายได้ ตามด้วย Mac, iPad และอุปกรณ์สวมใส่ — และขายบริการ (App Store, iCloud, การสมัครสมาชิก) ที่เก็บเงินซ้ำทุกเดือนและมีอัตรากำไรสูงมาก เครื่องที่ขายไปคือประตูสู่บริการเหล่านั้น",
        en: "Apple sells hardware — iPhone is half of revenue, then Mac, iPad and wearables — and services (App Store, iCloud, subscriptions) that recur monthly at very high margin. The devices are the doorway to those services.",
      },
      revenueMix: [
        { label: { th: "iPhone", en: "iPhone" }, sharePct: 50 },
        { label: { th: "บริการ (App Store, iCloud, สมาชิก)", en: "Services (App Store, iCloud, subscriptions)" }, sharePct: 26 },
        { label: { th: "อุปกรณ์สวมใส่และอื่น ๆ", en: "Wearables, home and accessories" }, sharePct: 9 },
        { label: { th: "Mac", en: "Mac" }, sharePct: 8 },
        { label: { th: "iPad", en: "iPad" }, sharePct: 7 },
      ],
      moat: {
        th: "อุปกรณ์ แอป รูปภาพ ข้อความ และการสมัครสมาชิกของผู้ใช้ผูกกันอยู่ในระบบเดียว การย้ายออกไปใช้ยี่ห้ออื่นแปลว่าต้องทิ้งของเหล่านั้นทั้งหมด ยิ่งใช้นานยิ่งย้ายยาก และแบรนด์ทำให้ตั้งราคาสูงได้",
        en: "A user's devices, apps, photos, messages and subscriptions all live in one system, and leaving means giving them up — the longer someone stays the harder it gets, and the brand supports premium pricing.",
      },
      moatStrength: "wide",
      strengths: [
        { th: "บริการเป็นรายได้ 26% แต่เป็นกำไรขั้นต้น 42% ที่อัตรา 75% และโต 14%", en: "Services is 26% of revenue but 42% of gross profit, at a 75% margin, growing 14%." },
        { th: "สร้างกระแสเงินสดอิสระเกือบ 1 แสนล้านต่อปี โดยลงทุนเพียง 3% ของรายได้", en: "It generates nearly $100B of free cash flow a year on capex of just 3% of revenue." },
        { th: "อัตรากำไรขั้นต้นของบริการเพิ่มขึ้นสามปีติด (71% → 74% → 75%)", en: "Services gross margin has risen three years running (71% → 74% → 75%)." },
      ],
      weaknesses: [
        { th: "iPhone เป็นครึ่งหนึ่งของรายได้ และเป็นตลาดที่อิ่มตัวแล้ว", en: "iPhone is half of revenue and its market is mature." },
        { th: "รายได้ในจีนหดตัว 4% ต่อจากที่หดไป 8% ปีก่อน", en: "Revenue in China fell 4%, after an 8% decline the year before." },
        { th: "กำไรสุทธิทรงถึงหดเบา ๆ สองปี (2023–24 กระทบจากภาษีย้อนหลัง) ก่อนฟื้นแรงในปี 2025", en: "Net profit was flat-to-down for two years (2023–24, hit by a back-tax charge) before a strong 2025 rebound." },
      ],
      competitors: ["Samsung", "Google (Android)", "Microsoft", "Huawei"],
    },
    businessRisks: [
      {
        risk: { th: "iPhone เป็นครึ่งหนึ่งของรายได้", en: "iPhone is half of all revenue" },
        why: {
          th: "รายได้ครึ่งหนึ่งขึ้นอยู่กับสินค้าตัวเดียว หากรอบการเปลี่ยนเครื่องยืดออกหรือยอดขายรุ่นใหม่ต่ำกว่าคาด รายได้ทั้งบริษัทสะเทือนทันที",
          en: "Half the revenue rests on one product. If the upgrade cycle stretches or a new model sells below plan, the whole company's revenue feels it at once.",
        },
        kind: "concentration",
      },
      {
        risk: { th: "ค่าธรรมเนียม App Store ถูกกดดันจากกฎหมาย", en: "App Store fees are under legal pressure" },
        why: {
          th: "กำไรก้อนใหญ่ของบริการมาจากส่วนแบ่งที่ Apple เก็บจากนักพัฒนา กฎหมายในยุโรปและคดีในสหรัฐฯ กำลังบีบให้ลดส่วนแบ่งนี้ ซึ่งกระทบธุรกิจที่กำไรดีที่สุด",
          en: "Much of the services profit is the cut Apple takes from developers. European law and US cases are pushing that cut down, striking the most profitable part of the business.",
        },
        kind: "regulation",
      },
      {
        risk: { th: "ยอดขายในจีนกำลังลดลง", en: "Sales in China are declining" },
        why: {
          th: "จีนเคยเป็นตลาดเติบโตสำคัญ แต่รายได้หดสองปีติด จากการแข่งขันของแบรนด์ท้องถิ่นและปัจจัยการเมืองระหว่างประเทศ",
          en: "China was a key growth market but revenue has shrunk two years running, from local-brand competition and geopolitics.",
        },
        kind: "competition",
      },
      {
        risk: { th: "ธุรกิจฮาร์ดแวร์ขึ้นกับกำลังซื้อของผู้บริโภค", en: "The hardware business depends on consumer spending" },
        why: {
          th: "การซื้อโทรศัพท์และคอมพิวเตอร์เครื่องใหม่เลื่อนออกได้ง่ายเมื่อเศรษฐกิจชะลอ ทำให้รายได้ฮาร์ดแวร์แกว่งตามวัฏจักรเศรษฐกิจ",
          en: "Buying a new phone or computer is easy to postpone in a downturn, so hardware revenue swings with the economic cycle.",
        },
        kind: "cyclical",
      },
    ],

    valuation: {
      bear: 83.79,
      base: 117.34,
      bull: 169.71,
      ev: 122.05,
      bearP: 0.25,
      baseP: 0.5,
      bullP: 0.25,
      trigger: 97.64,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "ราคา $320.83 = ~48 เท่าของกระแสเงินสดอิสระ และ 43 เท่าของกำไร ตลาดจ่ายพรีเมียมนี้บนความเชื่อว่าระบบนิเวศ + annuity ของบริการคือแฟรนไชส์คุณภาพที่คู่ควรกับตัวคูณสูงถาวร — ถ้าแยกส่วน ตลาดกำลังตีมูลค่าธุรกิจบริการที่ราว 101 เท่าของกระแสเงินสด",
        en: "At $320.83 the stock trades near 48x free cash flow and 43x earnings. The market pays that premium on the belief the ecosystem plus the services annuity is a quality franchise worth a permanently high multiple — split out, it implies a services value of about 101x its cash flow.",
      },
      us: {
        th: "แม้ตีมูลค่าธุรกิจบริการอย่างใจกว้างในฐานะ annuity ความเสี่ยงต่ำ (28 เท่า ที่ discount 8.74% จาก beta กลุ่ม Computer Services) และฮาร์ดแวร์ที่ 11 เท่า มูลค่ารวมได้ราว $122 — ไม่มีธุรกิจสมัครสมาชิกใดยั่งยืนที่ 101 เท่า ตัวแปรเดียวกับตลาด (ตัวคูณของบริการ) แต่ค่าต่างกันมาก",
        en: "Even valuing services generously as a low-risk annuity (28x, discounted at 8.74% from the Computer Services sector beta) and hardware at 11x, the parts sum to about $122. No subscription business sustains 101x. Same variable as the market — the services multiple — at a very different value.",
      },
    },

    killers: [
      { th: "รายได้บริการโต <8% YoY สองไตรมาสติด (annuity ชะลอ)", en: "Services revenue growth <8% YoY for two consecutive quarters (the annuity slows)" },
      { th: "อัตรากำไรขั้นต้นของบริการหลุดต่ำกว่า 70% (ผลจากกฎหมาย App Store)", en: "Services gross margin falls below 70% (App Store legal pressure bites)" },
      { th: "รายได้ iPhone หดเกิน 10% YoY โดยไม่มีหมวดใหม่มาชดเชย", en: "iPhone revenue falls more than 10% YoY with no new category to offset it" },
      { th: "รายได้จีนหดต่อเนื่องเป็นปีที่สามติดต่อกัน", en: "China revenue declines for a third consecutive year" },
      { th: "ราคาแตะ ~$98 (Trigger) — ช่องว่างต่อมูลค่าปิดลงจนน่าสนใจ", en: "Price reaches ~$98 (Trigger) — the gap to value closes to an interesting level" },
    ],
    catalysts: [
      { when: { th: "~ปลาย ต.ค. 2026", en: "~Late Oct 2026" }, what: { th: "งบ Q4 FY26 + ยอด iPhone รอบเปิดตัวใหม่ + ทิศทาง Services", en: "Q4 FY26 earnings + new-iPhone launch quarter + Services trajectory" } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: { th: "คำตัดสินคดี App Store (EU DMA / US antitrust) — จุดชี้ขาด margin บริการ", en: "App Store rulings (EU DMA / US antitrust) — the decider for services margin" } },
      { when: { th: "~ปลาย ม.ค. 2027", en: "~Late Jan 2027" }, what: { th: "งบ Q1 FY27 (ไตรมาสวันหยุด) + ยอดจีน", en: "Q1 FY27 earnings (holiday quarter) + China trajectory" } },
    ],
    returnMath: {
      floorPct: "−27.5%",
      onTrackPct: "−22.5%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมิน ($122) ภายใน 3 ปี — floor คือกลับเต็มที่ทันที on-track คือมูลค่าโต 7%/ปี ระหว่างที่ราคาไล่ตาม ทั้งคู่ติดลบหนักเพราะราคาปัจจุบันสูงกว่ามูลค่ามาก แต่พึงระวัง: พรีเมียมคุณภาพของ mega-cap อาจคงอยู่นานกว่าที่แบบจำลองคาด — การกลับสู่พื้นฐานไม่ใช่สิ่งที่รับประกัน",
        en: "These assume the price reverts to the estimate ($122) within 3 years — floor is full immediate reversion, on-track is value compounding 7%/yr as price catches down. Both are deeply negative because the price sits far above value. Caveat: a mega-cap quality premium can persist longer than a model expects; reversion is not guaranteed.",
      },
    },

    sensitivity: {
      rowLabel: { th: "การเติบโตของบริการ 5 ปี", en: "Services growth (5-year)" },
      colLabel: { th: "การเติบโตระยะยาวของบริการ", en: "Services terminal growth" },
      rows: ["13%", "11%", "10% (Base)", "8%", "6%"],
      cols: ["5.0%", "4.5%", "4.0% (Base)", "3.5%", "3.0%"],
      grid: [
        [149, 137, 128, 121, 114],
        [140, 129, 121, 114, 108],
        [135, 125, 117, 111, 106],
        [127, 118, 111, 105, 100],
        [120, 112, 105, 99, 95],
      ],
      baseRow: 2,
      baseCol: 2,
      caption: {
        th: "แม้ในมุมขวาบนสุด (บริการโต 13%/ปี ต่อเนื่องระยะยาว 5%) มูลค่าได้ $149 — ยังต่ำกว่าราคา $320.83 มาก · ทั้งตารางอยู่ใต้ราคา แปลว่าราคาปัจจุบันต้องการสมมติฐานที่อยู่นอกกริดนี้ · กรอบเข้ม = Base",
        en: "Even the top-right corner (Services growing 13%/yr with a 5% terminal rate) yields $149 — still far below the $320.83 price. The entire table sits below the price, so the current price requires assumptions outside this grid. Bold box = Base.",
      },
    },

    onePager: {
      th: "Apple เป็นหนึ่งในธุรกิจที่ดีที่สุดในโลก และตัวเลขก็ยืนยัน: กระแสเงินสดอิสระเกือบแสนล้านดอลลาร์ต่อปี อัตรากำไรสูงสุดในรอบห้าปี และธุรกิจบริการที่เก็บเงินซ้ำทุกเดือนด้วยอัตรากำไรขั้นต้น 75% ซึ่งแม้จะเป็นรายได้เพียงหนึ่งในสี่ แต่สร้างกำไรเกือบครึ่งของทั้งบริษัท เราให้คะแนนคุณภาพ 88 เต็ม 100 ปัญหาไม่ได้อยู่ที่ธุรกิจ แต่อยู่ที่ราคา ที่ $320 หุ้นเทรดราว 48 เท่าของกระแสเงินสดอิสระ เราลองตีมูลค่าแบบแยกส่วน — มองธุรกิจบริการเป็น annuity คุณภาพสูงความเสี่ยงต่ำ ให้ตัวคูณ 28 เท่า และฮาร์ดแวร์ที่ 11 เท่าตามธรรมชาติของสินค้าที่ต้องเปลี่ยนเครื่องเป็นรอบ — ได้มูลค่ารวมราว 122 ดอลลาร์ต่อหุ้น ต่ำกว่าราคาตลาดราว 62 เปอร์เซ็นต์ เมื่อคำนวณกลับ ราคาปัจจุบันแปลว่าตลาดกำลังตีมูลค่าธุรกิจบริการเพียงอย่างเดียวที่ราว 101 เท่าของกระแสเงินสด ซึ่งไม่มีธุรกิจสมัครสมาชิกใดในประวัติศาสตร์ยั่งยืนได้ที่ระดับนั้น ข้อสรุปจึงเหมือนกรณี Eli Lilly ที่เราเคยวิเคราะห์ คือบริษัทที่ดีที่สุดก็ขาดทุนได้ถ้าจ่ายแพงเกินไป นี่ไม่ใช่คำแนะนำให้ขาย และเราเตือนตัวเองว่าพรีเมียมคุณภาพของบริษัทระดับนี้อาจคงอยู่นานกว่าที่แบบจำลองคาด แต่คนที่ซื้อที่ราคานี้กำลังจ่ายล่วงหน้าสำหรับความสมบูรณ์แบบที่ต่อเนื่องไปอีกหลายปี จุดที่กรอบนี้จะเปลี่ยนเป็นน่าสนใจคือราว 98 ดอลลาร์ หรือเมื่อธุรกิจบริการพิสูจน์ว่าโตเร็วและกำไรหนากว่าที่เราประเมินไว้มาก",
      en: "Apple is one of the best businesses in the world, and the numbers confirm it: nearly $100 billion of free cash flow a year, the highest margins in five years, and a services business that bills every month at a 75% gross margin — a quarter of revenue but nearly half the profit. We score its quality 88 out of 100. The problem is not the business; it is the price. At $320 the stock trades near 48x free cash flow. We valued it in parts — treating services as a high-quality, low-risk annuity at 28x and hardware at 11x to match a replacement-cycle product — and the parts sum to about $122 a share, roughly 62% below the market price. Reverse the math and today's price implies the market values the services business alone at about 101x its cash flow, a level no subscription business in history has sustained. The conclusion echoes our Eli Lilly analysis: even the best company can lose you money if you overpay. This is not a sell call, and we remind ourselves that a franchise premium at this level can persist longer than a model expects — but a buyer here is paying in advance for years of continued perfection. The framework turns interesting around $98, or when services proves it grows faster and earns more than we have assumed.",
    },

    sources: [
      { label: "SEC EDGAR XBRL Company Facts (CIK 0000320193) — งบ 5 ปีทุกตัวเลข", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json" },
      { label: "Apple 10-K FY2025 — รายได้ตามหมวด + gross margin สินค้า/บริการ", url: "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm" },
      { label: "Damodaran — Betas by Sector (Computers/Peripherals, Computer Services, ม.ค. 2026)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Historical Implied ERP (US 4.42%, 2026-07-01)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histimpl.html" },
      { label: "US Treasury — 10Y yield 4.67% (2026-07-22)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2026/all?type=daily_treasury_yield_curve" },
    ],
  },
  {
    ticker: "META",
    company: "Meta Platforms",
    exchange: "NASDAQ",
    asOf: "2026-07-08",
    refPrice: 615.58,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ / รอจังหวะ", en: "Hold / Wait" },
    quality: 86,
    confidence: 4,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "Capex $125–145B ในปี 2026 (และแนวโน้มโตต่อ) จะแปลงเป็น revenue growth ≥13%/ปี พร้อม operating margin ยืน ≥40% ผ่านคลื่น depreciation ปี 2027–28 ได้หรือไม่ — พูดแบบเลขเดียว: ROIC จะยืนเหนือ WACC ~9.5% ระหว่างการเปลี่ยนผ่านหรือไม่",
      en: "Will the $125-145B capex in 2026 (and its growing trend) translate into revenue growth ≥13%/yr with operating margin ≥40% through the 2027-28 depreciation wave? In a single metric: Will ROIC stay above WACC ~9.5% during this transition?",
    },
    thesisOneSentence: {
      th: "Meta คือเครื่องผลิตกำไรโฆษณาที่ดีที่สุดในโลกที่กำลังเอากำไรทั้งหมดแทงว่าตัวเองจะเป็นเจ้าของโครงสร้างพื้นฐาน AI — ราคานี้จ่ายค่าเครื่องโฆษณาเต็มแล้ว แต่ยังไม่ได้ส่วนลดพอสำหรับเดิมพัน",
      en: "Meta is the world's best ad profit engine betting all its profits on becoming an AI infrastructure owner — current price fully values the ad engine but offers insufficient discount for the bet.",
    },

    // v4.2 Section 2A/7A — reviewed 2026-07-23.
    // Segment figures from the FY2025 10-K; capex and cash flow from the EDGAR
    // snapshot. Working paper: docs/2026-07-23-meta-lly-deep-o-v4.2-delta.md
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


    valuation: {
      bear: 352.37,
      base: 731.28,
      bull: 1133.85,
      ev: 698.12,
      bearP: 0.3,
      baseP: 0.5,
      bullP: 0.2,
      trigger: 558,
      verdictWord: { th: "มูลค่าเหมาะสม", en: "Fair Value" },
    },

    variant: {
      market: {
        th: "ราคา $615.58 ฝัง 5y revenue CAGR แค่ 10.0% (เทียบ track record 22–26%/ปี และ Q1'26 ที่ +33%) และเทรดที่ discount 21% ต่อ peer median ทั้งที่โตเร็วสุด — ตลาด price ว่า margin จะติดถาวรแถว 36–38% หรือ growth เหลือ ~10%",
        en: "Price $615.58 implies 5y revenue CAGR of only 10.0% (vs track record 22-26%/yr and Q1'26 +33%) and trades at 21% discount to peer median despite fastest growth. The market prices in permanent margin compression at 36-38% or growth dropping to ~10%.",
      },
      us: {
        th: "margin ย่อชั่วคราว 39% สองปีแล้วฟื้น 42% + growth เกาะ ~13.8% CAGR — ตัวแปรเดียวกับตลาดแต่ค่าต่างกัน (ตลาด 36–38% / 10%)",
        en: "Temporary margin dip to 39% for two years then recovering to 42% + growth sticking around ~13.8% CAGR. Same variables as the market but different values (market 36-38% / 10%).",
      },
    },

    killers: [
      { th: "Revenue growth <15% YoY สองไตรมาสติด", en: "Revenue growth <15% YoY for two consecutive quarters" },
      { th: "Capex guide 2027 >$180B โดย FCF ใกล้ศูนย์/ติดลบ และไม่มีโครงสร้างรับภาระ", en: "2027 Capex guide >$180B with near-zero/negative FCF and no burden-sharing structure" },
      { th: "Operating margin <35% สองไตรมาสติด", en: "Operating margin <35% for two consecutive quarters" },
      { th: "Reality Labs loss >$25B/ปี โดยไม่มี revenue inflection", en: "Reality Labs loss >$25B/yr with no revenue inflection" },
      { th: "Regulatory structural remedy (แยกธุรกิจ / จำกัด ad targeting EU-wide)", en: "Regulatory structural remedy (breakup / EU-wide ad targeting limits)" },
    ],
    catalysts: [
      { 
        when: { th: "~29 ก.ค. 2026", en: "~Jul 29, 2026" }, 
        what: { th: "งบ Q2'26 = Resolver R1+R2 (margin, growth, capex run-rate)", en: "Q2'26 Earnings = Resolver R1+R2 (margin, growth, capex run-rate)" } 
      },
      { 
        when: { th: "ต.ค. 2026", en: "Oct 2026" }, 
        what: { th: "งบ Q3'26 — ทิศ S/C, ความลึกของ FCF trough", en: "Q3'26 Earnings — S/C direction, depth of FCF trough" } 
      },
      { 
        when: { th: "~ม.ค. 2027", en: "~Jan 2027" }, 
        what: { th: "FY26 finals + capex guide 2027 = R3 (จุดตัดสิน Base vs Bear)", en: "FY26 finals + 2027 capex guide = R3 (Base vs Bear decider)" } 
      },
      { 
        when: { th: "2026H2–2027", en: "2026H2–2027" }, 
        what: { th: "Compute rental productization — optionality เริ่มมีรายได้จริง", en: "Compute rental productization — optionality starts generating real revenue" } 
      },
    ],
    returnMath: {
      floorPct: "+4.3%",
      onTrackPct: "+12.9%",
      note: {
        th: "ช่วง 4.3–12.9%/ปี (3 ปี) คร่อม CoE 9.76% พอดี — ถ้า Base เดินตามแผน ราคานี้จ่ายพอ ถ้าไม่ ก็ไม่จ่าย → ตรงกับสถานะ ถือ/รอหลักฐาน",
        en: "The +4.3–12.9%/yr range (3y) straddles the 9.76% CoE perfectly — if Base executes, this price pays off; if not, it doesn't → aligns with Hold/Wait for evidence status.",
      }
    },

    sensitivity: {
      rowLabel: { th: "Stable operating margin", en: "Stable operating margin" },
      colLabel: { th: "Growth scalar (y1–5 เทียบ Base)", en: "Growth scalar (y1–5 vs Base)" },
      rows: ["46%", "44%", "42%", "40%", "38%", "36%"],
      cols: ["0.6×", "0.8×", "1.0× (Base)", "1.2×", "1.4×"],
      grid: [
        [629, 714, 811, 924, 1052],
        [599, 679, 771, 877, 999],
        [569, 644, 731, 831, 946],
        [539, 610, 691, 785, 892],
        [509, 575, 651, 739, 839],
        [479, 541, 611, 693, 786],
      ],
      baseRow: 2,
      baseCol: 2,
      caption: {
        th: "ราคาตลาด ณ วันจัดทำ $615.58 ≈ โซน “margin 36–38% ที่ growth ปกติ” หรือ “margin 42% ที่ growth หายหนึ่งในสี่” — สองแกนของ One Question · กรอบเข้ม = Base",
        en: "Market price at publication $615.58 ≈ zone of '36-38% margin at normal growth' or '42% margin at a quarter lost growth' — the two axes of One Question. Bold box = Base",
      }
    },

    onePager: {
      th: "ทั้งรายงานนี้ตอบคำถามเดียว: เงินก้อนที่ใหญ่ที่สุดที่ Meta เคยจ่ายในชีวิต — งบสร้างศูนย์ข้อมูล AI ปีนี้ 125,000–145,000 ล้านดอลลาร์ มากกว่ากำไรทั้งปี — จะกลับมาเป็นการเติบโตและกำไรที่คุ้มหรือไม่ ตลาดตอบว่า \"ไม่คุ้ม\" ไปแล้วล่วงหน้า: ราคาหุ้นที่ 615 ดอลลาร์แพงแค่ 22 เท่าของกำไร ถูกกว่าเพื่อนร่วมกลุ่มทุกตัวทั้งที่โตเร็วกว่าทุกตัว และถ้าถอดรหัสราคานี้ออกมา มันฝังสมมติฐานว่า Meta จะโตแค่ปีละ 10% ไปห้าปี ทั้งที่ไตรมาสล่าสุดเพิ่งโต 33% เร็วสุดในรอบห้าปี นี่คือช่องว่างความเชื่อที่เราเดิมพัน: เราคิดว่าการโตจะเกาะระดับ 13–15% และกำไรขั้นปฏิบัติการจะย่อลงชั่วคราวแถว 39% ก่อนฟื้นเหนือ 40% เมื่อคลื่นค่าเสื่อมราคาจากเครื่อง server ถูกรายได้ใหม่ดูดซับ ฝั่งตลาดก็มีเหตุผลหนักแน่น — บริษัทปรับเป้าใช้เงินขึ้นสองครั้งในหกเดือน เริ่มกู้เงินจริงจังครั้งแรก และแผนก VR ยังขาดทุนปีละเกือบสองหมื่นล้าน — เราจึงไม่เถียงด้วยความรู้สึก แต่ตั้งตัววัดไว้สามตัว: งบไตรมาสหน้าปลายเดือนกรกฎาคมนี้ ถ้ากำไรขั้นปฏิบัติการยังยืนเหนือ 40% และรายได้โตเกิน 25% แปลว่าฝั่งเราถูก ถ้าหลุด 38% หรือโตต่ำกว่า 18% แปลว่าตลาดถูก และต้นปีหน้าดูเป้าใช้เงินปี 2027 ถ้าทะลุ 180,000 ล้าน คือสัญญาณถอย มูลค่าถ่วงน้ำหนักสามฉากทัศน์ของเราอยู่ที่ราว 698 ดอลลาร์ สูงกว่าราคาตลาดสิบสามเปอร์เซ็นต์ — ถูกจริงแต่ยังไม่ถูกพอ คำตัดสินคือถือและรอ: ซื้อเพิ่มเมื่อราคาต่ำกว่าราว 558 ดอลลาร์ หรือเมื่อตัววัดเดือนนี้ออกมายืนยันฝั่งเรา อย่างใดอย่างหนึ่งมาก่อน",
      en: "This entire report answers a single question: Will the largest sum Meta has ever spent—a $125-$145 billion AI data center budget this year, exceeding its annual profit—translate into justifiable growth and profit? The market has already answered 'no'. At $615, the stock trades at just 22x earnings, cheaper than all its peers despite growing faster than all of them. Decoding this price reveals an embedded assumption that Meta will only grow 10% annually for the next five years, despite a recent 33% quarterly growth (the fastest in five years). This is the belief gap we bet on: We expect growth to hover around 13-15% and operating margins to temporarily dip to 39% before recovering above 40% as the depreciation wave from servers is absorbed by new revenue. The market has solid reasoning—the company raised its spending target twice in six months, began borrowing seriously for the first time, and the VR division still loses nearly $20 billion annually. Thus, we don't argue with feelings; we set three measurable metrics. In the upcoming late-July earnings, if operating margins stay above 40% and revenue grows over 25%, we are right. If margins drop below 38% or growth falls below 18%, the market is right. Next year, if the 2027 capex guide breaches $180 billion, it's a signal to retreat. Our three-scenario weighted valuation sits around $698, thirteen percent above market price. It's cheap, but not cheap enough. The verdict is Hold and Wait: add to the position when the price dips below ~$558 or when this month's metrics confirm our thesis—whichever comes first.",
    },

    sources: [
      { label: "Moody's affirms Meta Aa3 stable (2026-02-27)", url: "https://ratings.moodys.com/ratings-news/419044" },
      { label: "S&P affirms AA− stable (cbonds)", url: "https://cbonds.com/news/3257869/" },
      { label: "S&P Global Ratings — Meta senior unsecured notes", url: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3554408" },
    ],
    pdfUrl: "/reports/meta-deep-o-v4.pdf",
  },

  {
    ticker: "LLY",
    company: "Eli Lilly and Company",
    exchange: "NYSE",
    asOf: "2026-07-10",
    refPrice: 1216.95,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ ห้ามเพิ่ม", en: "Hold / No Add" },
    quality: 91,
    confidence: 4,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "ธุรกิจ incretin (tirzepatide + orforglipron) จะรักษา volume × net price × ความทนทาน ได้ในระดับที่ทำให้รายได้โต ~20%+/ปี ไป 5 ปีหรือไม่ — เพราะราคาหุ้นวันนี้ฝัง 23.1% CAGR (รายได้ $204B ในปีที่ 5) ไว้แล้ว",
      en: "Will the incretin business (tirzepatide + orforglipron) maintain volume × net price × durability at a level that drives revenue growth ~20%+/yr for 5 years? Because today's stock price already embeds a 23.1% CAGR ($204B revenue in year 5).",
    },
    thesisOneSentence: {
      th: "Lilly คือบริษัทยาที่ดีที่สุดในโลกในรอบทศวรรษ แต่ราคาวันนี้เรียกร้องให้บริษัทโตปีละ 23% ไปห้าปี — สิ่งที่บริษัทรายได้ $72B แทบไม่เคยทำได้ในประวัติศาสตร์",
      en: "Lilly is the world's best pharmaceutical company of the decade, but today's price demands 23% annual growth for five years — something a $72B revenue company has rarely done in history.",
    },

    // v4.2 Section 2A/7A — reviewed 2026-07-23.
    // Product revenue from the FY2025 10-K, including its footnote that
    // tirzepatide is sold as both Mounjaro and Zepbound; balance-sheet figures
    // from the EDGAR snapshot. Working paper:
    // docs/2026-07-23-meta-lly-deep-o-v4.2-delta.md
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

    valuation: {
      bear: 298.49,
      base: 765.45,
      bull: 1221.78,
      ev: 762.79,
      bearP: 0.25,
      baseP: 0.5,
      bullP: 0.25,
      trigger: 610,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "ราคา $1,216.95 ฝัง revenue CAGR 23.1% ห้าปี → $204B ในปีที่ 5 (หรือถ้าโตตาม Base ต้องมี stable operating margin 60%) — หนุนด้วย Q1'26 +56%, guide ถูกยกเป็น $82–85B, CagriSema ของ Novo แพ้ head-to-head และ orforglipron ยากินตัวแรกได้อนุมัติ",
        en: "Price $1,216.95 embeds 5y revenue CAGR of 23.1% → $204B in year 5 (or if tracking Base, requires a stable 60% operating margin) — supported by Q1'26 +56%, guide raised to $82-85B, Novo's CagriSema losing head-to-head, and orforglipron (first oral) getting approved.",
      },
      us: {
        th: "รายได้โต 13.7% CAGR (→ $137B ปีที่ 5) + stable margin 42% — base rate ของบริษัทรายได้ >$70B ที่โต ≥20%/ปี ห้าปีติดแทบไม่มีในประวัติศาสตร์ และบริษัทเองยอมรับว่า realized price กำลังลดลง",
        en: "Revenue growing at 13.7% CAGR (→ $137B year 5) + stable 42% margin — the base rate of a >$70B revenue company growing ≥20%/yr for 5 consecutive years is historically virtually non-existent, and the company admits realized prices are falling.",
      },
    },

    killers: [
      { th: "Revenue growth <15% YoY สองไตรมาสติด", en: "Revenue growth <15% YoY for two consecutive quarters" },
      { th: "Operating margin <38% สองไตรมาสติด (price erosion กัดจริง)", en: "Operating margin <38% for two consecutive quarters (price erosion bites)" },
      { th: "tirzepatide ติดรายชื่อ Medicare negotiation หรือดีลราคาใหม่ที่ลด net price >15%", en: "tirzepatide added to Medicare negotiation list or new pricing deals cut net price >15%" },
      { th: "Guidance 2027 โตต่ำกว่า 15%", en: "2027 Guidance implies <15% growth" },
      { th: "Class-wide safety signal ของ GLP-1/GIP (label change ที่จำกัดการใช้)", en: "Class-wide safety signal for GLP-1/GIP (label changes restricting usage)" },
    ],
    catalysts: [
      { 
        when: { th: "~ต้น ส.ค. 2026", en: "~Early Aug 2026" }, 
        what: { th: "งบ Q2'26 = Resolver R1+R2 (growth, net price, การปรับ guide)", en: "Q2'26 Earnings = Resolver R1+R2 (growth, net price, guide revisions)" } 
      },
      { 
        when: { th: "ปลาย 2026", en: "Late 2026" }, 
        what: { th: "FDA ตัดสิน CagriSema ของ Novo — competitive intensity", en: "FDA ruling on Novo's CagriSema — competitive intensity" } 
      },
      { 
        when: { th: "ต.ค.–พ.ย. 2026", en: "Oct-Nov 2026" }, 
        what: { th: "งบ Q3'26 + trajectory ของ orforglipron (mix, margin)", en: "Q3'26 Earnings + orforglipron trajectory (mix, margin)" } 
      },
      { 
        when: { th: "~ก.พ. 2027", en: "~Feb 2027" }, 
        what: { th: "Guidance 2027 (R3) + รายชื่อ Medicare negotiation (R4) — จุดตัดสิน Base vs Bull", en: "2027 Guidance (R3) + Medicare negotiation list (R4) — Base vs Bull decider" } 
      },
    ],
    returnMath: {
      floorPct: "−14.4%",
      onTrackPct: "−7.7%",
      note: {
        th: "แม้แต่ขอบ on-track (มูลค่าเติบโตตาม cost of equity ระหว่างรอ) ผลตอบแทน 3 ปีก็ยังติดลบ และห่างจาก hurdle 8.37% มาก — ราคานี้ไม่ได้จ่ายค่าความเสี่ยง มันเรียกเก็บค่าความเชื่อ",
        en: "Even on the on-track edge (value growing at cost of equity), 3y returns are negative and far from the 8.37% hurdle. This price doesn't compensate for risk; it charges a premium for belief.",
      }
    },

    sensitivity: {
      rowLabel: { th: "Stable operating margin", en: "Stable operating margin" },
      colLabel: { th: "Growth scalar y1–5 (Base = 13.7% CAGR)", en: "Growth scalar y1-5 (Base = 13.7% CAGR)" },
      rows: ["50%", "46%", "42%", "38%", "34%", "30%"],
      cols: ["0.50×", "0.75×", "1.0× (Base)", "1.25×", "1.5×"],
      grid: [
        [648, 776, 925, 1098, 1300],
        [592, 709, 845, 1004, 1188],
        [536, 642, 765, 909, 1076],
        [480, 575, 686, 815, 965],
        [424, 508, 606, 720, 853],
        [368, 441, 526, 626, 741],
      ],
      baseRow: 2,
      baseCol: 2,
      caption: {
        th: "เกือบทั้งตารางอยู่ต่ำกว่าราคา ณ วันจัดทำ ($1,216.95) — ต้องไปมุมขวาบนสุด (margin 50% + growth 1.5×) ถึงจะเกินราคา · กรอบเข้ม = Base",
        en: "Almost the entire table is below the publication price ($1,216.95). Only the top-right corner (50% margin + 1.5x growth) justifies it. Bold box = Base",
      }
    },

    onePager: {
      th: "Eli Lilly คือบริษัทยาที่ทำผลงานดีที่สุดในโลกตอนนี้ ไม่ใช่คำชม แต่เป็นสิ่งที่ตัวเลขบอก: ปีที่แล้วรายได้โต 45 เปอร์เซ็นต์ ไตรมาสล่าสุดโต 56 เปอร์เซ็นต์ ยาลดน้ำหนักและเบาหวานสองตัวของบริษัท ซึ่งจริง ๆ คือสารตัวเดียวกันแต่คนละฉลาก ทำรายได้รวมกันเกือบสองในสามของทั้งบริษัท คู่แข่งที่ใกล้เคียงที่สุดอย่าง Novo Nordisk เพิ่งแพ้การทดลองเปรียบเทียบตรง ๆ และเมื่อเดือนเมษายนที่ผ่านมา Lilly ก็เพิ่งได้อนุมัติยาลดน้ำหนักแบบเม็ดตัวแรกของโลก ผลตอบแทนต่อเงินลงทุนของบริษัทอยู่ที่เกือบ 37 เปอร์เซ็นต์ ขณะที่ต้นทุนเงินทุนอยู่แค่ 8 เปอร์เซ็นต์ ซึ่งเป็นช่องว่างที่กว้างที่สุดที่กรอบวิเคราะห์นี้เคยเจอ เราให้คะแนนคุณภาพธุรกิจ 91 เต็ม 100 สูงที่สุดเท่าที่เคยให้มา แล้วปัญหาอยู่ตรงไหน อยู่ที่ราคา เมื่อเราถอดรหัสราคาหุ้นที่ 1,217 ดอลลาร์ออกมาเป็นสมมติฐาน มันบอกว่านักลงทุนกำลังคาดหวังให้บริษัทที่มีรายได้ 72,000 ล้านดอลลาร์ต่อปี เติบโตปีละ 23 เปอร์เซ็นต์ต่อเนื่องห้าปี จนรายได้แตะ 204,000 ล้านดอลลาร์ ซึ่งมากกว่ารายได้ของ Pfizer กับ Merck รวมกันในวันนี้ หรือไม่ก็ต้องมีอัตรากำไรขั้นปฏิบัติการ 60 เปอร์เซ็นต์ ระดับที่ไม่เคยมีบริษัทยาขนาดนี้ทำได้ ในขณะที่บริษัทเองยอมรับในไตรมาสล่าสุดว่ายอดขายโตด้วยปริมาณ แต่ราคาที่ขายได้จริงกำลังลดลงจากแรงกดดันของรัฐบาลและการแข่งขัน เมื่อเราสร้างแบบจำลองกระแสเงินสดสามฉากทัศน์ ได้มูลค่าที่ 298 ดอลลาร์ในกรณีเลวร้าย 765 ดอลลาร์ในกรณีฐาน และ 1,222 ดอลลาร์ในกรณีที่ทุกอย่างเข้าทาง สังเกตว่ากรณีดีที่สุดเท่ากับราคาตลาดพอดี แปลว่าราคาวันนี้ไม่เหลือส่วนเผื่อความปลอดภัยแม้แต่บาทเดียว ข้อสรุปจึงไม่ใช่ว่าบริษัทนี้ไม่ดี แต่คือหุ้นที่ดีที่สุดในโลกก็ยังขาดทุนได้ถ้าจ่ายแพงเกินไป คำตัดสินคือถือได้ถ้ามีอยู่แล้ว ห้ามซื้อเพิ่ม และเก็บไว้ใน watchlist โดยจุดที่กรอบนี้จะเปลี่ยนเป็นสัญญาณซื้อคือราว 610 ดอลลาร์ หรือเมื่อบริษัทพิสูจน์ว่ารายได้จะโตเกิน 20 เปอร์เซ็นต์ต่อไปได้จริงพร้อมกับราคาขายที่ไม่ถูกกดลง ตัววัดตัวแรกจะออกในงบไตรมาสหน้าต้นเดือนสิงหาคมนี้",
      en: "Eli Lilly is the best-performing pharmaceutical company in the world right now. This isn't a compliment; it's what the numbers say: Last year's revenue grew 45%, and the latest quarter grew 56%. Its two weight-loss and diabetes drugs—essentially the same compound under different labels—make up nearly two-thirds of the company's total revenue. Its closest competitor, Novo Nordisk, recently lost a direct head-to-head trial, and in April, Lilly secured approval for the world's first oral weight-loss pill. The return on invested capital stands at nearly 37%, while the cost of capital is only 8%—the widest gap this analytical framework has ever encountered. We awarded it a Business Quality score of 91 out of 100, the highest ever given. So, where is the problem? It lies in the price. When we decode the $1,217 stock price into assumptions, it reveals that investors expect a company with $72 billion in annual revenue to grow 23% per year for five consecutive years, reaching $204 billion in revenue—more than the combined revenue of Pfizer and Merck today. Alternatively, it would need a 60% operating margin, a level no pharmaceutical company of this size has ever achieved. Meanwhile, the company itself admitted in the last quarter that while sales volume is growing, actual realized prices are falling due to government pressure and competition. Our three-scenario cash flow model yields a value of $298 in the worst case, $765 in the base case, and $1,222 in the best case. Notice that the best-case scenario perfectly matches the market price, meaning today's price offers zero margin of safety. The conclusion isn't that this is a bad company; it's that even the best stock in the world can lose money if you overpay. The verdict is to Hold if you already own it, Do Not Add, and keep it on a watchlist. The point at which this framework flips to a Buy signal is around $610, or when the company can genuinely prove it can sustain >20% growth without price suppression. The first metric for this will emerge in early August's earnings report.",
    },

    sources: [
      {
        label: "SEC EDGAR XBRL Company Facts (CIK 0000059478) — งบทุกตัวเลขในรายงาน",
        url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000059478.json",
      },
      {
        label: "Lilly Q1 2026 press release — ยก guide เป็น $82–85B",
        url: "https://investor.lilly.com/news-releases/news-release-details/lilly-reports-first-quarter-2026-financial-results-raises-full",
      },
      {
        label: "AJMC — FDA อนุมัติ orforglipron (Foundayo), 2026-04-01",
        url: "https://www.ajmc.com/view/fda-approves-lilly-s-oral-glp-1-orforglipron-for-obesity",
      },
      {
        label: "CNBC — CagriSema ของ Novo แพ้ head-to-head (23.0% vs 25.5%)",
        url: "https://www.cnbc.com/2026/02/23/novo-nordisk-stock-cagrisema-trial-fails-weight-loss.html",
      },
      {
        label: "Damodaran — Betas by Sector (Drugs/Pharma unlevered 0.89, ม.ค. 2026)",
        url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html",
      },
      {
        label: "Moody's affirms Aa3, outlook → positive (2025-12-12)",
        url: "https://cbonds.com/news/3722203/",
      },
    ],
    pdfUrl: "/reports/lly-deep-o-v4.pdf",
  },

  {
    ticker: "AMZN",
    company: "Amazon.com",
    exchange: "NASDAQ",
    asOf: "2026-07-10",
    refPrice: 247.04,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ ห้ามเพิ่ม", en: "Hold / No Add" },
    quality: 80,
    confidence: 3,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "capex ~$200B/ปี จะแปลงเป็น AWS growth + operating margin ที่ทำให้ incremental ROIC ยืนเหนือ WACC ~8% ได้จริง — หรือจะกลายเป็นคลื่นค่าเสื่อมราคาที่กิน margin ก่อนที่รายได้จะตามทัน?",
      en: "Will the ~$200B/yr capex truly translate into AWS growth + operating margins that keep incremental ROIC above WACC (~8%)? Or will it become a wave of depreciation that eats margins before revenue can catch up?",
    },
    thesisOneSentence: {
      th: "Amazon กำลังเอากระแสเงินสดทั้งหมดที่หามาได้ไปแทงกับโครงสร้างพื้นฐาน AI — เดิมพันที่สมเหตุสมผลเพราะ incremental ROIC ยัง 13.6% แต่ราคาหุ้นวันนี้จ่ายไปแล้วสำหรับผลลัพธ์ที่ยังไม่เกิด",
      en: "Amazon is betting all its generated cash flow on AI infrastructure — a reasonable bet since incremental ROIC is still 13.6%, but today's stock price has already paid for results that haven't materialized yet.",
    },

    // v4.2 Section 2A/7A — reviewed 2026-07-23.
    // Figures from the FY2025 10-K disaggregation table and the EDGAR snapshot;
    // working paper: docs/2026-07-23-amzn-deep-o-v4.2-delta.md
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
    businessRisks: [
      {
        risk: { th: "กำไรเกินครึ่งมาจาก AWS ธุรกิจเดียว", en: "More than half the profit comes from AWS alone" },
        why: {
          th: "AWS เป็นรายได้แค่ 18% แต่เป็นกำไร 57% ถ้าธุรกิจนี้สะดุด กำไรทั้งบริษัทสะเทือนทันทีแม้ยอดขายรวมยังโต",
          en: "AWS is 18% of sales but 57% of profit, so a stumble there hits company profit at once even while total sales still grow.",
        },
        kind: "concentration",
      },
      {
        risk: { th: "เงินลงทุนก้อนใหญ่ยังไม่กลายเป็นเงินสด", en: "The large investment has not turned into cash yet" },
        why: {
          th: "ปี 2025 ใช้เงินลงทุน 131.8 พันล้าน คิดเป็น 18% ของรายได้ ทำให้เงินสดอิสระเหลือ 7.7 พันล้าน จาก 32.9 พันล้านปีก่อน",
          en: "2025 capital spending of $131.8B — 18% of revenue — cut free cash flow to $7.7B from $32.9B.",
        },
        kind: "execution",
      },
      {
        risk: { th: "คลาวด์คู่แข่งโตเร็วกว่า", en: "Rival clouds are growing faster" },
        why: {
          th: "AWS ยังมีส่วนแบ่งมากที่สุด แต่เติบโตราว 20% ต่อปี ขณะที่คู่แข่งรายใหญ่สองรายโตเร็วกว่านั้นชัดเจน (ตัวเลขส่วนแบ่งมาจากผู้รวบรวมภายนอก ไม่ใช่งบบริษัท)",
          en: "AWS still holds the largest share but grows around 20% a year while its two largest rivals grow visibly faster. Share figures come from third-party trackers, not filings.",
        },
        kind: "competition",
      },
      {
        risk: { th: "รายได้ 82% ผูกกับกำลังซื้อของผู้บริโภค", en: "82% of revenue depends on consumer spending" },
        why: {
          th: "ธุรกิจค้าปลีกทำกำไรบางอยู่แล้วที่ 5.8% เมื่อคนใช้จ่ายน้อยลง กำไรส่วนนี้หายได้เร็วกว่ายอดขายที่ลดลง",
          en: "Retail already runs on a thin 5.8% margin, so its profit falls faster than its sales when households spend less.",
        },
        kind: "cyclical",
      },
    ],

    valuation: {
      bear: 67.86,
      base: 180.43,
      bull: 310.14,
      ev: 184.71,
      bearP: 0.25,
      baseP: 0.5,
      bullP: 0.25,
      trigger: 148,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "ราคา $247.04 ต้องการอย่างใดอย่างหนึ่ง (หรือผสมกัน): revenue CAGR 18.5% ห้าปี → $1.74T ในปีที่ 5 หรือ stable operating margin 19.5% (TTM จริง 11.5%) — หนุนด้วย AWS +28% เร็วสุดใน 15 ไตรมาส, operating income +30%, และผู้บริหารบอกว่ามี customer commitments รองรับ capex ส่วนใหญ่แล้ว",
        en: "Price $247.04 demands one of the following (or a mix): 5y revenue CAGR 18.5% → $1.74T in year 5, or stable 19.5% operating margin (actual TTM 11.5%) — supported by AWS +28% (fastest in 15 quarters), operating income +30%, and management stating customer commitments already back most capex.",
      },
      us: {
        th: "revenue CAGR 11.2% (→ $1.26T ปีที่ 5) + stable margin 15% — เพราะ capex/D&A 2.14× (คลื่นค่าเสื่อมยังไม่เข้า P&L เต็ม), FCF ติดลบแล้ว, S/C ตกจาก ~2.5 เหลือ 1.20 และ incremental ROIC 13.6% ต่ำกว่า ROIC เฉลี่ย 16.0%",
        en: "Revenue CAGR 11.2% (→ $1.26T year 5) + stable 15% margin — because capex/D&A is 2.14x (depreciation wave hasn't fully hit P&L yet), FCF has turned negative, Sales/Capital dropped from ~2.5 to 1.20, and incremental ROIC is 13.6% (lower than the 16.0% average ROIC).",
      },
    },

    killers: [
      { th: "AWS growth <20% YoY สองไตรมาสติด", en: "AWS growth <20% YoY for two consecutive quarters" },
      { th: "Consolidated operating margin <11% สองไตรมาสติด", en: "Consolidated operating margin <11% for two consecutive quarters" },
      { th: "Capex guide 2027 >$250B โดย FCF ยังติดลบ", en: "2027 Capex guide >$250B with FCF still negative" },
      { th: "TTM free cash flow ติดลบ 4 ไตรมาสติดกัน", en: "TTM Free Cash Flow negative for 4 consecutive quarters" },
      { th: "Rating outlook เป็นลบ / downgrade (Credit Module activate อยู่แล้ว)", en: "Negative rating outlook / downgrade (Credit Module already activated)" },
    ],
    catalysts: [
      { 
        when: { th: "~ปลาย ก.ค. 2026", en: "~Late Jul 2026" }, 
        what: { th: "งบ Q2'26 = Resolver R1 (guide: net sales $194–199B, OI $20–24B)", en: "Q2'26 Earnings = Resolver R1 (guide: net sales $194-199B, OI $20-24B)" } 
      },
      { 
        when: { th: "ต.ค. 2026", en: "Oct 2026" }, 
        what: { th: "งบ Q3'26 — FCF trajectory (R3), ความลึกของ trough", en: "Q3'26 Earnings — FCF trajectory (R3), depth of the trough" } 
      },
      { 
        when: { th: "~ก.พ. 2027", en: "~Feb 2027" }, 
        what: { th: "งบ FY26 + capex guide 2027 (R2) — จุดตัดสิน Base vs Bear", en: "FY26 Earnings + 2027 capex guide (R2) — Base vs Bear decider" } 
      },
      { 
        when: { th: "ต่อเนื่อง", en: "Ongoing" }, 
        what: { th: "Trainium adoption, Kuiper/Leo commercialization — optionality → รายได้จริง", en: "Trainium adoption, Kuiper/Leo commercialization — optionality → actual revenue" } 
      },
    ],
    returnMath: {
      floorPct: "−9.2%",
      onTrackPct: "−1.7%",
      note: {
        th: "ไม่มีปันผล → g_v = CoE 8.25% · ทั้ง floor และ on-track ติดลบใน 3 ปี (5 ปี on-track = +2.1% ก็ยังต่ำกว่า hurdle) — ราคานี้ยังไม่จ่ายค่าความเสี่ยงของ capex cycle",
        en: "No dividend → g_v = CoE 8.25%. Both floor and on-track are negative over 3 years (5y on-track = +2.1%, still below hurdle). This price does not yet compensate for the capex cycle risk.",
      }
    },

    sensitivity: {
      rowLabel: { th: "Stable operating margin", en: "Stable operating margin" },
      colLabel: { th: "Growth scalar y1–5 (Base = 11.2% CAGR)", en: "Growth scalar y1-5 (Base = 11.2% CAGR)" },
      rows: ["21%", "19%", "17%", "15%", "13%", "11%"],
      cols: ["0.6×", "0.8×", "1.0× (Base)", "1.2×", "1.4×"],
      grid: [
        [220, 243, 269, 298, 330],
        [197, 217, 239, 264, 293],
        [174, 191, 210, 231, 255],
        [150, 165, 180, 198, 218],
        [127, 138, 151, 165, 181],
        [104, 112, 122, 132, 144],
      ],
      baseRow: 3,
      baseCol: 2,
      caption: {
        th: "ต้องได้ margin ~19% ที่ growth ปกติ (หรือ 21% ที่ growth ต่ำกว่า) ถึงจะ justify ราคา ณ วันจัดทำ $247.04 · กรอบเข้ม = Base (margin 15%, growth 1.0×) = $180",
        en: "Needs ~19% margin at normal growth (or 21% at lower growth) to justify the publication price of $247.04. Bold box = Base (15% margin, 1.0x growth) = $180",
      }
    },

    onePager: {
      th: "Amazon กำลังทำสิ่งที่ทั้งกล้าหาญและน่ากังวลพร้อมกัน: เอากระแสเงินสดเกือบทั้งหมดที่ธุรกิจหามาได้ ปีละเกือบ 150,000 ล้านดอลลาร์ เทลงไปในการสร้างศูนย์ข้อมูลปัญญาประดิษฐ์ ชิปของตัวเอง และดาวเทียม จนแผนใช้เงินลงทุนปีนี้แตะระดับ 200,000 ล้านดอลลาร์ ผลคือเงินสดอิสระ ซึ่งเคยเหลือปีละสามหมื่นกว่าล้าน ตอนนี้ติดลบเล็กน้อยเป็นครั้งแรกในรอบหลายปี และนั่นทำให้กรอบวิเคราะห์ของเราเปิดโหมดตรวจสอบเครดิตโดยอัตโนมัติเป็นครั้งแรก ข่าวดีคืองบดุลยังแข็งแรงมาก บริษัทมีเงินสดมากกว่าหนี้ อันดับเครดิตอยู่ระดับ AA และธุรกิจคลาวด์ AWS เพิ่งกลับมาเติบโต 28 เปอร์เซ็นต์ เร็วที่สุดในรอบเกือบสี่ปี พร้อมกำไรจากการดำเนินงานที่โต 30 เปอร์เซ็นต์ เร็วกว่ารายได้ แปลว่าเครื่องยนต์ยังดี ปัญหาอยู่ที่ราคา ตัวเลขกำไรที่ดูสวยงามในไตรมาสล่าสุดนั้น เกือบครึ่งหนึ่งมาจากการตีมูลค่าหุ้นที่ถืออยู่ใน Anthropic ขึ้นมา 16,800 ล้านดอลลาร์ ซึ่งเป็นกำไรกระดาษ ไม่ใช่เงินสด ถ้าเอาส่วนนี้ออก หุ้นซื้อขายที่ 40 เท่าของกำไรจริง ไม่ใช่ 30 เท่าอย่างที่เห็น และเมื่อเราถอดรหัสราคา 247 ดอลลาร์ออกมา มันเรียกร้องให้รายได้โตปีละ 18.5 เปอร์เซ็นต์ไปห้าปี จนแตะ 1.7 ล้านล้านดอลลาร์ หรือไม่ก็ต้องมีอัตรากำไรขั้นปฏิบัติการ 19.5 เปอร์เซ็นต์ ทั้งที่วันนี้ทำได้ 11.5 เปอร์เซ็นต์ แบบจำลองสามฉากทัศน์ของเราให้มูลค่า 68 ดอลลาร์ในกรณีเลวร้าย 180 ดอลลาร์ในกรณีฐาน และ 310 ดอลลาร์ในกรณีที่ทุกอย่างเข้าทาง ถ่วงน้ำหนักแล้วได้ 185 ดอลลาร์ ต่ำกว่าราคาตลาดหนึ่งในสี่ ข้อควรระวังคือคำตัดสินนี้อยู่ใกล้เส้นแบ่ง ถ้าเชื่อฝั่งกระทิงหนักขึ้นอีกนิดจะกลายเป็นราคาที่เหมาะสม เราจึงไม่ฟันธงว่าแพงจนต้องขาย แต่บอกว่าถือได้ ห้ามซื้อเพิ่ม และเฝ้าตัวเลขสามตัว: AWS ยังโตเกิน 25 เปอร์เซ็นต์ไหม กำไรขั้นปฏิบัติการไต่ขึ้นหรือถูกค่าเสื่อมกด และเงินสดอิสระกลับมาเป็นบวกเมื่อไหร่ ตัววัดชุดแรกออกปลายเดือนกรกฎาคมนี้ จุดที่กรอบนี้จะเปลี่ยนเป็นสัญญาณซื้อคือราว 148 ดอลลาร์",
      en: "Amazon is doing something simultaneously courageous and concerning: pouring almost all its generated cash flow—nearly $150 billion annually—into building AI data centers, proprietary chips, and satellites. This year's capex budget touches a record $200 billion. As a result, Free Cash Flow, which used to net over $30 billion a year, is now slightly negative for the first time in years. This triggered our framework's credit check module for the first time. The good news is the balance sheet remains exceptionally strong: more cash than debt, an AA credit rating, and the AWS cloud business just accelerated to 28% growth (its fastest in nearly four years) alongside operating profits growing 30%, faster than revenue. The engine works perfectly. The problem is the price. The beautiful profit numbers in the latest quarter were significantly inflated by a $16.8 billion mark-to-market gain on its Anthropic stake—paper profit, not cash. Strip that out, and the stock trades at 40x real earnings, not the 30x headline figure. When we reverse-engineer the $247 stock price, it demands 18.5% annual revenue growth for five years (hitting $1.7 trillion) or a stable 19.5% operating margin (versus today's 11.5%). Our three-scenario model yields $68 in the worst case, $180 in the base case, and $310 in the best case. The probability-weighted value is $185, a quarter below the market price. The caveat: this verdict is on the borderline. Believe the bull case just a fraction more, and the stock looks fairly valued. Therefore, we don't declare it a screaming sell, but rather a Hold (Do Not Add), while monitoring three metrics: Does AWS sustain >25% growth? Are operating margins climbing or being crushed by depreciation? And when does Free Cash Flow turn positive? The first set of clues arrives in late July. The point at which this framework flips to a Buy signal is around $148.",
    },

    sources: [
      {
        label: "SEC EDGAR XBRL Company Facts (CIK 0001018724) — งบทุกตัวเลขในรายงาน",
        url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0001018724.json",
      },
      {
        label: "CNBC — Amazon Q1 2026 earnings",
        url: "https://www.cnbc.com/2026/04/29/amazon-amzn-q1-earnings-report-2026.html",
      },
      {
        label: "TNW — $16.8B Anthropic gain inflates net income as free cash flow collapses 95%",
        url: "https://thenextweb.com/news/amazon-q1-2026-anthropic-aws-earnings",
      },
      {
        label: "Investing.com — Q1'26 slides: AWS +28%, record margins offset by capex",
        url: "https://www.investing.com/news/company-news/amazon-q1-2026-slides-aws-surges-28-record-margins-offset-by-capex-93CH-4647447",
      },
      {
        label: "Damodaran — Betas by Sector (ไม่มี Retail (Online) → blend เอง)",
        url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html",
      },
      {
        label: "Moody's rating action — Amazon.com",
        url: "https://ratings.moodys.com/ratings-news/403348",
      },
    ],
    pdfUrl: "/reports/amzn-deep-o-v4.pdf",
  },
  {
    ticker: "TSLA",
    company: "Tesla, Inc.",
    exchange: "NASDAQ",
    asOf: "2026-07-30",
    refPrice: 298.85,

    verdict: "trim",
    verdictEmoji: "🟠",
    verdictLabel: { th: "ลดน้ำหนัก", en: "Reduce" },
    quality: 66,
    confidence: 3,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "ส่วนที่เป็นรถแท็กซี่ไร้คนขับ หุ่นยนต์ Optimus และระบบ AI มีมูลค่าถึงราว 983 พันล้านดอลลาร์ตามที่ตลาดตีไว้หรือไม่ เมื่อธุรกิจที่เดินอยู่จริงคือขายรถ ขายแบตเตอรี่ และงานบริการ อธิบายมูลค่าได้เพียง 102 ถึง 196 พันล้าน จากมูลค่าบริษัททั้งหมด 1,180 พันล้าน",
      en: "Is the robotaxi, Optimus and AI piece worth the roughly $983B the market assigns it, when the business that actually operates today — selling cars, batteries and services — explains only $102–196B of a $1,180B company?",
    },
    thesisOneSentence: {
      th: "Tesla กำลังเผากำไรของธุรกิจรถทั้งหมดเพื่อสร้างธุรกิจใหม่สองอย่างที่ยังไม่มีรายได้ และราคาหุ้นวันนี้จ่ายค่าธุรกิจใหม่นั้นไว้แล้วเกือบเต็มจำนวน ก่อนที่มันจะพิสูจน์ตัวเอง",
      en: "Tesla is burning the entire profit of its car business to build two new businesses that have no revenue yet — and today's share price has already paid for them, in full, before they have proved anything.",
    },

    business: {
      whatItDoes: {
        th: "Tesla ผลิตและขายรถยนต์ไฟฟ้า ซึ่งเป็นรายได้เกือบสามในสี่ของบริษัท ส่วนที่เหลือคือแบตเตอรี่กักเก็บพลังงานสำหรับบ้านและโรงไฟฟ้า และงานบริการอย่างซ่อมบำรุง ประกัน และสถานีชาร์จ",
        en: "Tesla makes and sells electric cars, which are almost three-quarters of its revenue. The rest is battery storage for homes and power grids, plus services such as repairs, insurance and charging.",
      },
      revenueMix: [
        { label: { th: "ยานยนต์", en: "Automotive" }, sharePct: 73 },
        { label: { th: "บริการและอื่น ๆ", en: "Services and other" }, sharePct: 16 },
        { label: { th: "ผลิตและกักเก็บพลังงาน", en: "Energy generation and storage" }, sharePct: 11 },
      ],
      moat: {
        th: "โรงงานขนาดใหญ่ที่ผลิตทั้งรถและแบตเตอรี่เองทำให้ต้นทุนต่อคันต่ำกว่าคู่แข่งส่วนใหญ่ และเครือข่ายสถานีชาร์จกว่า 82,000 หัวจ่ายเป็นสิ่งที่ผู้ผลิตรายอื่นยังไม่มี ทั้งสองอย่างเป็นความได้เปรียบด้านต้นทุนและความสะดวก ไม่ใช่สิ่งที่ห้ามคู่แข่งเข้ามา",
        en: "Large factories that build both the cars and the batteries keep cost per vehicle below most rivals, and a charging network of over 82,000 connectors is something no other carmaker has. Both are advantages of cost and convenience, not barriers that keep competitors out.",
      },
      moatStrength: "narrow",
      strengths: [
        {
          th: "ส่งมอบรถ 480,126 คันในไตรมาส สูงสุดเป็นสถิติของไตรมาสสอง",
          en: "Delivered 480,126 cars in the quarter, a second-quarter record.",
        },
        {
          th: "ผู้สมัครใช้ระบบช่วยขับ 1.48 ล้านราย เพิ่มขึ้น 56% ในหนึ่งปี",
          en: "1.48 million driver-assistance subscribers, up 56% in a year.",
        },
        {
          th: "มีเงินสด 43.5 พันล้าน มากกว่าหนี้ทั้งหมดสี่เท่า",
          en: "Holds $43.5B of cash, over four times its total debt.",
        },
      ],
      weaknesses: [
        {
          th: "กำไรจากการดำเนินงานเหลือ 1.4% ของรายได้ จาก 10.8% เมื่อสองปีก่อน",
          en: "Operating profit is 1.4% of revenue, down from 10.8% two years ago.",
        },
        {
          th: "ค่าตอบแทนที่จ่ายเป็นหุ้นทั้งปีเท่ากับกำไรสุทธิทั้งปีพอดี",
          en: "A full year of stock-based pay equals a full year of net profit.",
        },
        {
          th: "กำไรปี 2023 ที่ใช้เทียบมีสิทธิประโยชน์ภาษีก้อนเดียว 5.75 พันล้านอยู่ในนั้น",
          en: "The 2023 profit used as a base contained a one-off $5.75B tax benefit.",
        },
      ],
      competitors: ["BYD", "Volkswagen", "General Motors", "Waymo", "Uber"],
    },
    businessRisks: [
      {
        risk: { th: "กำไรหายไปเกือบหมดแม้ยอดขายจะโต", en: "Profit has nearly vanished even as sales grow" },
        why: {
          th: "ไตรมาสล่าสุดขายได้มากขึ้น 26% แต่กำไรจากการดำเนินงานลดลง 57% เพราะค่าใช้จ่ายด้านวิจัยและค่าตอบแทนพนักงานเพิ่มเร็วกว่ารายได้",
          en: "Sales rose 26% last quarter while operating profit fell 57%, because research spending and staff pay grew faster than revenue.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "มูลค่าส่วนใหญ่ผูกกับธุรกิจที่ยังไม่มีรายได้",
          en: "Most of the value rests on businesses with no revenue yet",
        },
        why: {
          th: "รถแท็กซี่ไร้คนขับและหุ่นยนต์ยังอยู่ในขั้นเริ่มต้น ไมล์ที่มีผู้จ่ายเงินสะสมอยู่ราวสองล้านห้าแสนไมล์ ถ้าไม่สำเร็จตามที่คาด ธุรกิจรถและพลังงานที่มีอยู่รองรับราคาปัจจุบันไม่ได้",
          en: "The robotaxi and the robot are at an early stage, with about 2.5 million cumulative paid miles. If they fall short, the existing car and energy businesses cannot support today's price.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "เงินอุดหนุนจากรัฐที่เคยเป็นกำไรล้วนกำลังหมดไป",
          en: "Government credits that were almost pure profit are disappearing",
        },
        why: {
          th: "รายได้จากการขายเครดิตกำกับดูแลลดจาก 439 ล้านเหลือ 146 ล้านในหนึ่งปี ซึ่งเป็นรายได้ที่แทบไม่มีต้นทุน การหายไปจึงกระทบกำไรเต็มจำนวน",
          en: "Regulatory credit revenue fell from $439M to $146M in a year. It carries almost no cost, so its loss hits profit in full.",
        },
        kind: "regulation",
      },
      {
        risk: {
          th: "ตลาดรถไฟฟ้ามีคู่แข่งเพิ่มและราคาขายต่อคันลดลง",
          en: "More rivals in electric cars, and price per car is falling",
        },
        why: {
          th: "บริษัทระบุเองว่าราคาขายเฉลี่ยต่อคันลดลง สวนทางกับต้นทุนที่ต้องแบกจากภาษีนำเข้าและการลงทุนที่เพิ่มขึ้น",
          en: "The company states its average selling price per car is falling, while it carries higher costs from import duties and rising investment.",
        },
        kind: "competition",
      },
      {
        risk: {
          th: "รถแท็กซี่ไร้คนขับต้องใช้เงินลงทุนมหาศาลก่อนมีรายได้",
          en: "The robotaxi needs enormous investment before any revenue",
        },
        why: {
          th: "ค่าลงทุนไตรมาสล่าสุด 5.8 พันล้าน เพิ่มขึ้น 142% ทำให้กระแสเงินสดอิสระติดลบเป็นครั้งแรกในรอบสองปี",
          en: "Capital spending reached $5.8B last quarter, up 142%, pushing free cash flow negative for the first time in two years.",
        },
        kind: "financial",
      },
    ],

    valuation: {
      bear: 25.32,
      base: 97.47,
      bull: 429.37,
      ev: 155.19,
      bearP: 0.35,
      baseP: 0.4,
      bullP: 0.25,
      trigger: 124.15,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "แยกส่วนราคาออกมา มูลค่าบริษัท 1,180 พันล้าน ลบธุรกิจแกนที่ประเมินอย่างเอื้อเฟื้อที่สุดคือ 196 พันล้าน เหลือ 983 พันล้าน หรือ 83% ของราคา ที่ตลาดจ่ายให้รถแท็กซี่ไร้คนขับ หุ่นยนต์ และระบบ AI คิดกลับด้วยต้นทุนเงินทุน 10.44% ก้อนนี้ต้องสร้างกำไรหลังภาษี 88 ถึง 133 พันล้านต่อปีภายในปี 2036",
        en: "Split the price apart: a $1,180B company less a generously valued core of $196B leaves $983B, or 83% of the price, paid for the robotaxi, the robot and the AI. Discounted back at a 10.44% cost of capital, that piece must earn $88–133B a year after tax by 2036.",
      },
      us: {
        th: "เราถ่วงน้ำหนักมูลค่าก้อนนั้นได้ราว 465 พันล้าน ไม่ใช่ 983 พันล้าน เพราะเทียบขนาดแล้ว Apple ทั้งบริษัททำกำไรได้ 112 พันล้านต่อปี และ Uber ทั้งบริษัทมียอดจองรวม 193 พันล้านในปี 2025 ต่อให้ยึดธุรกิจเรียกรถทั้งโลกได้หมดที่กำไรหลังภาษี 40% ก็ได้ราว 100 พันล้าน พอดีเส้นล่างที่ต้องการ ขณะที่วันนี้ไมล์ที่มีผู้จ่ายเงินสะสมอยู่ราวสองล้านห้าแสนไมล์",
        en: "We weight that piece at about $465B, not $983B. For scale: Apple as a whole earns $112B a year, and Uber's entire 2025 gross bookings were $193B. Taking 100% of global ride-hailing at a 40% after-tax margin yields roughly $100B — barely the lower bound — while cumulative paid robotaxi miles today are about 2.5 million.",
      },
    },

    killers: [
      {
        th: "รถแท็กซี่ไร้คนขับแยกเป็นบรรทัดรายได้ในงบ หรือไมล์สะสมที่มีผู้จ่ายเงินเกิน 100 ล้านไมล์",
        en: "Robotaxi appears as its own revenue line, or cumulative paid miles pass 100 million",
      },
      {
        th: "กำไรจากการดำเนินงานไม่รวมรายการพิเศษ ฟื้นเหนือ 5% ภายในสองไตรมาส",
        en: "Operating margin excluding one-offs recovers above 5% within two quarters",
      },
      {
        th: "บริษัทเริ่มระบุจำนวนหุ่นยนต์ Optimus ที่ผลิตได้เป็นตัวเลข",
        en: "The company starts stating an actual number of Optimus units produced",
      },
      {
        th: "ผู้สมัครใช้ระบบช่วยขับเกิน 2 ล้านราย และอัตราติดตั้งในอเมริกาเหนือเกิน 60%",
        en: "Driver-assistance subscribers pass 2 million and North American attach rate passes 60%",
      },
      {
        th: "ราคาลงแตะราว 124 ดอลลาร์ ซึ่งเป็นจุดที่ช่องว่างต่อมูลค่าปิดลงจนน่าสนใจ",
        en: "The price reaches about $124, where the gap to value closes to an interesting level",
      },
    ],
    catalysts: [
      { when: { th: "~22 ต.ค. 2026", en: "~Oct 22, 2026" }, what: {
        th: "งบไตรมาส 3 ตัดสินพร้อมกันสามเรื่อง คืออัตรากำไร กระแสเงินสด และการเติบโตของผู้สมัครระบบช่วยขับ",
        en: "Q3 earnings settle three things at once: margin, cash flow and driver-assistance subscriber growth",
      } },
      { when: { th: "~28 ม.ค. 2027", en: "~Jan 28, 2027" }, what: {
        th: "งบทั้งปี 2026 พร้อมตัวเลขรถแท็กซี่ไร้คนขับและหุ่นยนต์ ถ้ามีการเปิดเผย",
        en: "FY2026 results, with robotaxi and robot figures if they are disclosed",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "การอนุมัติให้วิ่งไร้คนคุมในรัฐและเมืองใหม่",
        en: "Approvals to run without a safety driver in new states and cities",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "ภาษีนำเข้าและการยกเลิกเงินอุดหนุนรถไฟฟ้าในสหรัฐ",
        en: "Import duties and the winding down of US electric-vehicle incentives",
      } },
    ],
    returnMath: {
      floorPct: "−12.3%",
      onTrackPct: "−3.1%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่งแล้วราคาไล่ลงมาหา ส่วน on-track คือมูลค่าโตปีละ 10.5% ระหว่างที่ราคาปิดช่องว่าง Tesla ไม่จ่ายปันผลและไม่ซื้อหุ้นคืน ข้อควรระวังที่ต่างจากหุ้นตัวอื่นคือ ค่ากลางไม่ใช่ตัวแทนที่ดีของผลลัพธ์ เพราะการกระจายเป็นแบบสองขั้ว ถ้าการขับเคลื่อนอัตโนมัติสำเร็จ ฉากบวกที่ 429 ดอลลาร์เป็นไปได้จริง ถ้าไม่สำเร็จ ฉากลบที่ 25 ดอลลาร์ก็เป็นไปได้จริง ค่ากลางที่ 155 เป็นตัวเลขที่แทบไม่มีใครได้เห็น",
        en: "These assume the price reverts to the estimate within five years — floor is value standing still while price falls to meet it, on-track is value compounding 10.5% a year as the gap closes. Tesla pays no dividend and buys back no stock. One caveat is specific to this name: the average is a poor description of the outcome, because the distribution is bimodal. If autonomy works, the $429 case is real; if it does not, the $25 case is real. The $155 midpoint is a number almost nobody will actually experience.",
      },
    },

    sensitivity: {
      rowLabel: { th: "ความน่าจะเป็นของฉากบวก", en: "Probability of the bull case" },
      colLabel: { th: "มูลค่าธุรกิจใหม่ในฉากบวก", en: "Value of the new businesses in the bull case" },
      rows: ["15%", "25% (Base)", "35%", "45%"],
      cols: ["$750B", "$1,000B", "$1,500B (Base)", "$2,500B"],
      grid: [
        [94, 103, 122, 160],
        [108, 124, 155, 219],
        [122, 144, 188, 277],
        [136, 165, 222, 336],
      ],
      baseRow: 1,
      baseCol: 2,
      caption: {
        th: "แกนทั้งสองคือสิ่งที่ตัดสินหุ้นตัวนี้จริง ๆ คือความน่าจะเป็นที่ธุรกิจใหม่จะสำเร็จ และมูลค่าของมันถ้าสำเร็จ มีเพียงช่องเดียวจากสิบหกช่องที่สูงกว่าราคาตลาด 298.85 ดอลลาร์ คือมุมขวาล่างซึ่งต้องเชื่อทั้งว่าโอกาสสำเร็จเกือบครึ่ง และมูลค่าเมื่อสำเร็จสูงถึง 2.5 ล้านล้าน กรอบเข้ม = Base",
        en: "These two axes are what actually decide this stock: the chance the new businesses work, and what they are worth if they do. Only one cell of sixteen clears the $298.85 price — the bottom-right, which requires believing both in a near-even chance of success and in a $2.5 trillion payoff. Bold box = Base.",
      },
    },

    onePager: {
      th: "Tesla ขายรถได้มากที่สุดเป็นสถิติในไตรมาสที่ผ่านมา รายได้โต 26 เปอร์เซ็นต์ แต่กำไรจากการดำเนินงานลดลง 57 เปอร์เซ็นต์ เหลือเพียง 1.4 เปอร์เซ็นต์ของรายได้ จากที่เคยทำได้ 10.8 เปอร์เซ็นต์เมื่อสองปีก่อน กำไรสุทธิที่รายงานออกมา 1,114 ล้านดอลลาร์ดูเหมือนยังดี แต่ในนั้นมีกำไรทางบัญชีจากการตีมูลค่าหุ้น SpaceX ที่บริษัทถืออยู่ 1,005 ล้าน และรายการภาษีอีก 274 ล้าน ถอดสองอย่างนี้ออก กำไรจากการทำธุรกิจจริงเหลือราว 77 ล้าน ใกล้ศูนย์ และถ้ามองทั้งปี ค่าตอบแทนที่จ่ายเป็นหุ้น 3,798 ล้าน เท่ากับกำไรสุทธิทั้งปี 3,804 ล้านพอดี แปลว่าในมุมของเจ้าของกิจการ บริษัทนี้ยังไม่เหลืออะไรกลับมา ผลตอบแทนต่อเงินลงทุนอยู่ที่ 6.6 เปอร์เซ็นต์ ต่ำกว่าต้นทุนเงินทุน 10.4 เปอร์เซ็นต์ ซึ่งหมายความว่าทุกดอลลาร์ที่ลงทุนเพิ่มวันนี้ทำลายมูลค่า ไม่ใช่สร้าง เราให้คะแนนคุณภาพ 66 เต็ม 100 อยู่ในระดับกลาง แต่คำถามที่แท้จริงไม่ได้อยู่ที่ตัวเลขเหล่านี้เลย เราลองประเมินมูลค่าธุรกิจที่เดินอยู่จริง คือขายรถ ขายแบตเตอรี่ และงานบริการ อย่างเอื้อเฟื้อที่สุดเท่าที่เถียงได้ คือให้อัตรากำไร 12 เปอร์เซ็นต์ซึ่งดีกว่าโตโยต้า และให้โต 18 เปอร์เซ็นต์ต่อปีห้าปี ได้มูลค่า 196 พันล้านดอลลาร์ หรือราว 50 ดอลลาร์ต่อหุ้น ขณะที่ราคาตลาดคือ 298.85 ดอลลาร์ ส่วนต่างราว 983 พันล้าน หรือ 83 เปอร์เซ็นต์ของราคาทั้งหมด คือสิ่งที่ตลาดจ่ายให้รถแท็กซี่ไร้คนขับ หุ่นยนต์ Optimus และระบบ AI คิดกลับด้วยต้นทุนเงินทุน ก้อนนี้ต้องสร้างกำไรหลังภาษีระหว่าง 88 ถึง 133 พันล้านดอลลาร์ต่อปี ภายในปี 2036 ซึ่งมากกว่ากำไรทั้งบริษัทของ Apple ที่ทำได้ 112 พันล้านในวันนี้ เทียบขนาดอีกทาง Uber ทั้งบริษัทมียอดจองรวม 193 พันล้านในปี 2025 ต่อให้ Tesla ยึดธุรกิจเรียกรถทั้งโลกได้หมดและทำกำไรหลังภาษี 40 เปอร์เซ็นต์ ก็ได้ราว 100 พันล้าน พอดีเส้นล่างที่ต้องการ วันนี้ไมล์ที่มีผู้จ่ายเงินของรถแท็กซี่ไร้คนขับสะสมอยู่ราวสองล้านห้าแสนไมล์ และหุ่นยนต์ยังไม่มีรายได้ สิ่งที่เราไม่อ้างว่าตอบได้คือ การขับเคลื่อนอัตโนมัติจะสำเร็จหรือไม่ เพราะข้อโต้แย้งฝั่งที่มองบวกไม่ใช่การแย่งส่วนแบ่งจาก Uber แต่คือการที่คนเลิกเป็นเจ้าของรถ ซึ่งเป็นการเปลี่ยนวิถีสังคม ไม่ใช่การพยากรณ์ส่วนแบ่งตลาด งบการเงินบอกเรื่องนั้นไม่ได้ เราจึงกดระดับความเชื่อมั่นเหลือ 3 จาก 5 และให้คำตัดสินลดน้ำหนัก ไม่ใช่ขาย ผู้ที่ซื้อที่ราคานี้กำลังเดิมพันเรื่องการขับเคลื่อนอัตโนมัติ ไม่ใช่เดิมพันเรื่องธุรกิจรถ และควรรู้ตัวว่ากำลังเดิมพันอะไรอยู่ กรอบนี้จะเปลี่ยนเป็นน่าสนใจที่ราว 124 ดอลลาร์ หรือเมื่อรถแท็กซี่ไร้คนขับเริ่มปรากฏเป็นบรรทัดรายได้ในงบการเงิน อย่างใดอย่างหนึ่งมาก่อน",
      en: "Tesla delivered a record number of cars last quarter and revenue grew 26%, yet operating profit fell 57% to just 1.4% of revenue, down from 10.8% two years ago. The reported net profit of $1,114M looks respectable, but it contains a $1,005M accounting gain on Tesla's stake in SpaceX and another $274M of tax items. Strip those out and profit from actually running the business is about $77M — essentially zero. Over a full year, stock-based pay of $3,798M matches net profit of $3,804M almost exactly, so from an owner's point of view nothing is left over. Return on invested capital is 6.6% against a 10.4% cost of capital, which means every additional dollar invested today destroys value rather than creating it. We score quality 66 out of 100, in the middle band. But the real question is not in any of those numbers. We valued the business that actually operates — cars, batteries and services — as generously as can be argued: a 12% operating margin, better than Toyota, growing 18% a year for five years. That yields $196B, or about $50 a share, against a market price of $298.85. The difference, roughly $983B or 83% of the price, is what the market pays for the robotaxi, Optimus and the AI. Discounted back at the cost of capital, that piece must earn between $88B and $133B a year after tax by 2036 — more than Apple's entire $112B profit today. For another sense of scale, Uber's whole 2025 gross bookings were $193B; even if Tesla took all of global ride-hailing at a 40% after-tax margin it would earn about $100B, barely the lower bound. Today the robotaxi has around 2.5 million cumulative paid miles and the robot has no revenue at all. What we do not claim to answer is whether autonomy will work, because the bullish argument is not about taking share from Uber — it is about people ceasing to own cars, a change in how society moves rather than a market-share forecast. Financial statements cannot settle that, so we cap our confidence at 3 out of 5 and call this reduce rather than sell. Anyone buying here is betting on autonomy, not on the car business, and should know which bet they are making. The framework turns interesting near $124, or when the robotaxi first appears as a revenue line in the accounts — whichever comes first.",
    },

    sources: [
      { label: "SEC EDGAR XBRL Company Facts (CIK 0001318605) — งบรายปีและรายไตรมาส", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0001318605.json" },
      { label: "Tesla 8-K Exhibit 99.1 — Q2 2026 Update (22 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/1318605/000162828026049213/exhibit991.htm" },
      { label: "Tesla 10-Q งวด 30 มิ.ย. 2026 (ยื่น 23 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/1318605/000162828026049270/tsla-20260630.htm" },
      { label: "Damodaran — Betas by Sector (Auto & Truck, unlevered 1.31)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
      { label: "Uber ผลประกอบการทั้งปี 2025 — ยอดจองรวม 193 พันล้าน", url: "https://investor.uber.com/news-events/news/press-release-details/2026/Uber-Announces-Results-for-Fourth-Quarter-and-Full-Year-2025/default.aspx" },
    ],
    pdfUrl: "/reports/tsla-deep-o-v42.pdf",
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corporation",
    exchange: "NASDAQ",
    asOf: "2026-07-30",
    refPrice: 390.54,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ / รอจังหวะ", en: "Hold / Wait" },
    quality: 92,
    confidence: 4,
    uncertainty: "MED",

    oneQuestion: {
      th: "เงินลงทุนศูนย์ข้อมูล AI ที่ 115.9 พันล้านดอลลาร์ในปีเดียว ซึ่งเพิ่มขึ้น 80 เปอร์เซ็นต์และคิดเป็น 35 เปอร์เซ็นต์ของรายได้ จะแปลงเป็นรายได้ที่รักษาอัตรากำไรจากการดำเนินงานเหนือ 44 เปอร์เซ็นต์ได้หรือไม่ โดยที่กระแสเงินสดอิสระไม่ติดลบ",
      en: "Will $115.9B of AI datacentre spending in a single year — up 80%, now 35% of revenue — convert into revenue that holds the operating margin above 44%, without free cash flow turning negative?",
    },
    thesisOneSentence: {
      th: "Microsoft กำลังใช้กำไรที่มีคุณภาพที่สุดในตลาดไปสร้างโครงสร้างพื้นฐาน AI ด้วยเงินก้อนที่ใหญ่ที่สุดในประวัติศาสตร์บริษัท และตลาดคิดลดราคาให้เรื่องนั้นมากกว่าที่ตัวเลขบอก แต่ยังไม่มากพอที่จะเรียกว่าถูก",
      en: "Microsoft is spending the highest-quality profit stream in the market on the largest build-out in its history, and the market discounts that more than the numbers warrant — but not yet enough to call the stock cheap.",
    },

    business: {
      whatItDoes: {
        th: "Microsoft ขายซอฟต์แวร์และบริการคลาวด์ให้องค์กรเป็นหลัก โดยเก็บค่าสมาชิกรายเดือนหรือรายปี รายได้ก้อนใหญ่ที่สุดคือ Azure ซึ่งให้เช่าเซิร์ฟเวอร์และพลังประมวลผล รองลงมาคือชุดโปรแกรมทำงาน Microsoft 365 ส่วนที่เหลือคือ Windows เกม Xbox และโฆษณาบนเสิร์ช",
        en: "Microsoft mainly sells software and cloud services to organisations, billed monthly or yearly. Its largest line is Azure, which rents out servers and computing power, followed by the Microsoft 365 work suite. The remainder is Windows, Xbox games and search advertising.",
      },
      revenueMix: [
        { label: { th: "Intelligent Cloud (Azure และเซิร์ฟเวอร์)", en: "Intelligent Cloud (Azure and servers)" }, sharePct: 44 },
        { label: {
          th: "Productivity and Business Processes (Microsoft 365, LinkedIn)",
          en: "Productivity and Business Processes (Microsoft 365, LinkedIn)",
        }, sharePct: 42 },
        { label: {
          th: "More Personal Computing (Windows, Xbox, เสิร์ช)",
          en: "More Personal Computing (Windows, Xbox, search)",
        }, sharePct: 14 },
      ],
      moat: {
        th: "องค์กรที่ใช้ Microsoft 365 กับ Azure ผูกทั้งอีเมล ไฟล์ ระบบยืนยันตัวตน และระบบงานภายในไว้ด้วยกัน การย้ายออกต้องเปลี่ยนทั้งระบบพร้อมกันและฝึกพนักงานใหม่ทั้งบริษัท ยอดที่ทำสัญญาไว้แล้วแต่ยังไม่รับรู้เป็นรายได้อยู่ที่ 678 พันล้านดอลลาร์ หรือราวสองเท่าของรายได้ทั้งปี",
        en: "An organisation on Microsoft 365 and Azure has its email, files, sign-in system and internal workflows tied together. Leaving means replacing all of it at once and retraining every employee. Contracts signed but not yet recognised as revenue stand at $678B, roughly twice a full year of sales.",
      },
      moatStrength: "wide",
      strengths: [
        {
          th: "ผลตอบแทนต่อเงินลงทุน 31% สูงกว่าต้นทุนเงินทุนราวสามเท่า",
          en: "Return on invested capital of 31%, about three times its cost of capital.",
        },
        {
          th: "ยอดสัญญาที่รอรับรู้รายได้ 678 พันล้าน เพิ่มขึ้น 84% ในหนึ่งปี",
          en: "$678B of contracted future revenue, up 84% in a year.",
        },
        {
          th: "อันดับเครดิตสูงสุดจากทั้ง S&P และ Moody's มีเพียงสองบริษัทในอเมริกา",
          en: "Top credit rating from both S&P and Moody's — only two US companies have it.",
        },
      ],
      weaknesses: [
        {
          th: "เงินลงทุนพุ่งเป็น 115.9 พันล้าน หรือ 35% ของรายได้ เพิ่มขึ้น 80% ในปีเดียว",
          en: "Capital spending hit $115.9B, or 35% of revenue, up 80% in one year.",
        },
        {
          th: "อัตรากำไรจากการดำเนินงานลดจาก 48.9% เหลือ 45.1% ภายในสี่ไตรมาส",
          en: "Operating margin fell from 48.9% to 45.1% within four quarters.",
        },
        {
          th: "กระแสเงินสดอิสระลดลงสองปีติด ทั้งที่กำไรสุทธิเพิ่มขึ้น 31%",
          en: "Free cash flow fell for a second year even as net profit rose 31%.",
        },
      ],
      competitors: ["Amazon", "Google", "Oracle", "Salesforce", "Apple"],
    },
    businessRisks: [
      {
        risk: {
          th: "เงินลงทุนก้อนใหญ่จะกลายเป็นค่าเสื่อมที่กินกำไรในปีถัดไป",
          en: "Today's spending becomes tomorrow's depreciation",
        },
        why: {
          th: "บริษัทใช้เงินลงทุน 115.9 พันล้านในปีเดียว เพิ่มขึ้น 80 เปอร์เซ็นต์ ค่าเสื่อมของสิ่งที่สร้างจะทยอยหักกำไรในปี 2027 และ 2028 ไม่ว่ารายได้จะโตทันหรือไม่",
          en: "The company spent $115.9B in one year, up 80%. Depreciation on what it built will press on profit through 2027 and 2028 whether or not revenue keeps pace.",
        },
        kind: "financial",
      },
      {
        risk: { th: "อัตรากำไรกำลังลดลงต่อเนื่องแล้ว", en: "The margin is already falling" },
        why: {
          th: "กำไรจากการดำเนินงานลดจาก 48.9 เปอร์เซ็นต์เหลือ 45.1 เปอร์เซ็นต์ของรายได้ภายในสี่ไตรมาส ซึ่งเป็นสัญญาณว่าคลื่นค่าเสื่อมเริ่มลงแล้วจริง ไม่ใช่แค่ความกังวล",
          en: "Operating profit fell from 48.9% to 45.1% of revenue in four quarters, which shows the depreciation wave has already started rather than merely being feared.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "ความต้องการด้าน AI อาจชะลอกว่าที่วางกำลังผลิตไว้",
          en: "AI demand may slow relative to the capacity being built",
        },
        why: {
          th: "การเติบโตของ Azure มาจากงานที่เกี่ยวกับ AI เป็นหลัก ถ้าลูกค้าองค์กรชะลอการลงทุน ศูนย์ข้อมูลที่สร้างไว้จะกลายเป็นต้นทุนที่ยังต้องจ่ายโดยไม่มีรายได้มารองรับ",
          en: "Azure's growth comes mainly from AI workloads. If corporate customers slow their spending, the datacentres already built become a cost that still has to be paid with no revenue behind it.",
        },
        kind: "cyclical",
      },
      {
        risk: { th: "ธุรกิจฝั่งผู้บริโภคกำลังหดตัว", en: "The consumer side is shrinking" },
        why: {
          th: "รายได้จาก Windows ที่ติดมากับเครื่องใหม่ลดลง 7 เปอร์เซ็นต์ และเนื้อหาเกม Xbox ลดลง 10 เปอร์เซ็นต์ พร้อมการตั้งด้อยค่าในไตรมาสล่าสุด",
          en: "Windows revenue from new PCs fell 7% and Xbox content fell 10%, alongside an impairment charge in the latest quarter.",
        },
        kind: "competition",
      },
      {
        risk: {
          th: "กำไรที่รายงานมีส่วนที่มาจากการตีมูลค่าเงินลงทุน",
          en: "Reported profit includes gains from marking up investments",
        },
        why: {
          th: "กำไรสุทธิทั้งปีเพิ่ม 31 เปอร์เซ็นต์ตามมาตรฐานบัญชี แต่ถ้าตัดผลจากการลงทุนใน OpenAI ออกจะเพิ่ม 22 เปอร์เซ็นต์ และไตรมาสล่าสุดมีกำไรจากการลงทุนใน Anthropic 3.2 พันล้าน",
          en: "Full-year net profit rose 31% on a reported basis, but 22% once the OpenAI investment impact is removed. The latest quarter also carried a $3.2B gain on the Anthropic investment.",
        },
        kind: "financial",
      },
    ],

    valuation: {
      bear: 199.0,
      base: 335.0,
      bull: 471.0,
      ev: 341.7,
      bearP: 0.25,
      baseP: 0.45,
      bullP: 0.3,
      trigger: 273.36,
      verdictWord: { th: "มูลค่าเหมาะสม", en: "Fair Value" },
    },

    variant: {
      market: {
        th: "หุ้นลงจากจุดสูงในรอบปีราว 30 เปอร์เซ็นต์ ทั้งที่ผลประกอบการเร่งขึ้น เมื่อคำนวณย้อนกลับจากราคา 390.54 ดอลลาร์ ตลาดฝังสมมติฐานว่ารายได้จะโตเพียง 12.4 เปอร์เซ็นต์ต่อปีต่อเนื่องสิบปี ตลาดกำลังตีราคาว่าเงินลงทุน 115.9 พันล้านจะกลายเป็นค่าเสื่อมที่กินกำไร โดยรายได้จาก AI โตไม่ทันชดเชย และอัตรากำไรจะถอยจาก 47 เปอร์เซ็นต์ลงมาต่ำกว่า 44",
        en: "The stock is down about 30% from its one-year high even as results accelerate. Reversed out of the $390.54 price, the market embeds revenue growth of just 12.4% a year for a decade. It is pricing the $115.9B of spending as depreciation that will eat profit faster than AI revenue can offset, pushing the operating margin from 47% down below 44%.",
      },
      us: {
        th: "เราไม่ได้ต่างจากตลาดเรื่องการเติบโตมากนัก คือมองราว 11.5 เปอร์เซ็นต์ต่อปีโดยเฉลี่ย แต่ต่างเรื่องอัตรากำไรปลายทาง เรามองว่ายืนได้ 44 ถึง 45 เปอร์เซ็นต์ เพราะกำไรจากการดำเนินงานปีล่าสุดโต 21 เปอร์เซ็นต์ซึ่งเร็วกว่ารายได้ที่โต 17.8 และยอดสัญญาที่รอรับรู้รายได้โต 84 เปอร์เซ็นต์เป็น 678 พันล้าน สิ่งที่ต่างจากหุ้นตัวอื่นที่เราวิเคราะห์คือ ราคานี้เรียกร้องน้อยกว่าที่บริษัททำอยู่ ไม่ใช่มากกว่า",
        en: "We are not far from the market on growth — about 11.5% a year on average — but we differ on the terminal margin, seeing 44–45% hold. Operating profit grew 21% last year against revenue of 17.8%, and contracted future revenue rose 84% to $678B. What separates this from the other names we have looked at is that the price asks for less than the business is delivering, not more.",
      },
    },

    killers: [
      {
        th: "อัตรากำไรจากการดำเนินงานรายไตรมาสหลุดต่ำกว่า 42 เปอร์เซ็นต์ สองไตรมาสติด",
        en: "Quarterly operating margin falls below 42% for two consecutive quarters",
      },
      { th: "การเติบโตของ Azure ต่ำกว่า 28 เปอร์เซ็นต์", en: "Azure growth falls below 28%" },
      {
        th: "ยอดสัญญาที่รอรับรู้รายได้โตต่ำกว่า 20 เปอร์เซ็นต์ ความชัดเจนเรื่องรายได้หายไป",
        en: "Contracted future revenue grows below 20%, and the visibility disappears",
      },
      {
        th: "เงินลงทุนปีงบ 2027 เกิน 180 พันล้าน โดยกระแสเงินสดอิสระยังลดลงต่อเนื่อง",
        en: "FY2027 capital spending exceeds $180B while free cash flow keeps falling",
      },
      {
        th: "กระแสเงินสดอิสระรายไตรมาสติดลบ แม้เพียงไตรมาสเดียว",
        en: "Quarterly free cash flow turns negative, even once",
      },
      {
        th: "ราคาลงแตะราว 273 ดอลลาร์ ซึ่งเป็นจุดที่ช่องว่างต่อมูลค่าปิดจนน่าสนใจ",
        en: "The price reaches about $273, where the gap to value closes to an interesting level",
      },
    ],
    catalysts: [
      { when: { th: "~28 ต.ค. 2026", en: "~Oct 28, 2026" }, what: {
        th: "งบไตรมาสแรกปีงบ 2027 ตัดสินพร้อมกันสี่เรื่อง คืออัตรากำไร Azure ยอดสัญญา และตัวเลขเงินลงทุนปีงบ 2027",
        en: "Q1 FY2027 earnings settle four things at once: margin, Azure, contracted revenue and the FY2027 capital spending figure",
      } },
      { when: { th: "~27 ม.ค. 2027", en: "~Jan 27, 2027" }, what: {
        th: "งบไตรมาสสอง จะเห็นว่ามีการเปลี่ยนอายุการใช้งานอาคารศูนย์ข้อมูลหรือไม่",
        en: "Q2 results will show whether the useful life of datacentre buildings has been changed",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "ราคาหน่วยความจำและอุปทานชิป ซึ่งเป็นตัวขับเงินลงทุน",
        en: "Memory prices and chip supply, which drive the spending",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: { th: "โครงสร้างความสัมพันธ์กับ OpenAI", en: "The structure of the relationship with OpenAI" } },
    ],
    returnMath: {
      floorPct: "−2.6%",
      onTrackPct: "+6.0%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่งแล้วราคาไล่ลงมาหา ส่วน on-track คือมูลค่าโตปีละ 8.9 เปอร์เซ็นต์ระหว่างที่ราคาปิดช่องว่าง จุดสำคัญคือช่วงตั้งแต่ติดลบ 2.6 ถึงบวก 6.0 อยู่ใต้ต้นทุนของทุนที่ 10.25 เปอร์เซ็นต์ทั้งช่วง แปลว่าที่ราคานี้ผลตอบแทนคาดหวังยังไม่ชดเชยความเสี่ยง แม้ธุรกิจจะมีคุณภาพสูงที่สุดเท่าที่กรอบนี้เคยให้คะแนน นี่คือความหมายของถือ ไม่ใช่ซื้อเพิ่ม ในเชิงตัวเลข",
        en: "These assume the price reverts to the estimate within five years — floor is value standing still while price falls to meet it, on-track is value compounding 8.9% a year as the gap closes. The point is that the whole range, from −2.6% to +6.0%, sits below the 10.25% cost of equity. At this price the expected return does not compensate for the risk, even though the business scores the highest quality this framework has awarded. That is what hold-rather-than-add means numerically.",
      },
    },

    sensitivity: {
      rowLabel: {
        th: "รายได้ที่สร้างได้ต่อเงินลงทุน — จุดเริ่มต้น",
        en: "Revenue generated per unit of investment — starting point",
      },
      colLabel: { th: "จุดที่คลายตัวไปถึงใน 10 ปี", en: "Where it eases to over ten years" },
      rows: ["0.43 (ของจริง FY26)", "0.60 (Base)", "0.80", "1.10"],
      cols: ["1.5", "2.0 (Base)", "2.5", "3.0"],
      grid: [
        [315, 323, 328, 331],
        [329, 335, 339, 342],
        [339, 344, 347, 350],
        [348, 352, 355, 357],
      ],
      baseRow: 1,
      baseCol: 1,
      caption: {
        th: "สมมติฐานที่เปราะที่สุดของรายงานนี้คือความเร็วที่เงินลงทุนจะคลายตัว ปีล่าสุดบริษัทใช้เงินลงทุน 115.9 พันล้านเพื่อรายได้ที่เพิ่มขึ้น 50.1 พันล้าน คิดเป็นอัตราส่วน 0.43 ซึ่งคือแถวบนสุด ทั้งตารางอยู่ใต้ราคา 390.54 ดอลลาร์ แม้ในกรณีที่คลายตัวเร็วที่สุดก็ได้เพียง 357 ดอลลาร์ ช่วงที่แคบเพราะอัตรากำไรสูงมากจนความเข้มข้นของการลงทุนมีผลน้อยกว่าบริษัททั่วไป กรอบเข้ม = Base",
        en: "The most fragile assumption here is how fast the spending eases. Last year the company invested $115.9B to add $50.1B of revenue, a ratio of 0.43 — the top row. Every cell sits below the $390.54 price; even the fastest easing reaches only $357. The range is narrow because margins are high enough that investment intensity matters less than it would elsewhere. Bold box = Base.",
      },
    },

    onePager: {
      th: "Microsoft ปิดปีงบ 2026 ด้วยรายได้ 331.8 พันล้านดอลลาร์ เพิ่มขึ้น 18 เปอร์เซ็นต์ และกำไรจากการดำเนินงาน 155.2 พันล้าน เพิ่มขึ้น 21 เปอร์เซ็นต์ ซึ่งแปลว่ากำไรโตเร็วกว่ารายได้ ทั้งที่ปีนี้เป็นปีที่บริษัทใช้เงินลงทุนมากที่สุดในประวัติศาสตร์ คือ 115.9 พันล้าน เพิ่มขึ้น 80 เปอร์เซ็นต์ในปีเดียว หรือคิดเป็น 35 เปอร์เซ็นต์ของรายได้ทั้งหมด Azure โต 43 เปอร์เซ็นต์และมีรายได้ทะลุแสนล้านดอลลาร์ต่อปีเป็นครั้งแรก ยอดสัญญาที่ลูกค้าเซ็นแล้วแต่ยังไม่รับรู้เป็นรายได้อยู่ที่ 678 พันล้าน เพิ่มขึ้น 84 เปอร์เซ็นต์ หรือราวสองเท่าของรายได้ทั้งปี ซึ่งเป็นความชัดเจนเรื่องรายได้ในอนาคตที่หาได้ยากมาก ผลตอบแทนต่อเงินลงทุนอยู่ที่ 31 เปอร์เซ็นต์ เทียบต้นทุนเงินทุน 10.2 เปอร์เซ็นต์ มีเงินสดมากกว่าหนี้ และได้อันดับเครดิตสูงสุดจากทั้ง S&P และ Moody's ซึ่งมีเพียงสองบริษัทมหาชนในอเมริกาที่ทำได้ เราให้คะแนนคุณภาพ 92 เต็ม 100 ซึ่งเป็นคะแนนสูงที่สุดที่กรอบนี้เคยให้ แต่ราคาหุ้นกลับลงมาราว 30 เปอร์เซ็นต์จากจุดสูงสุดในรอบปี เพราะตลาดกังวลว่าเงินลงทุนก้อนนี้จะกลายเป็นค่าเสื่อมที่กินกำไร ความกังวลนั้นมีมูล อัตรากำไรจากการดำเนินงานลดจาก 48.9 เปอร์เซ็นต์เหลือ 45.1 เปอร์เซ็นต์ภายในสี่ไตรมาส และกระแสเงินสดอิสระลดลงสองปีติดกันแม้จะยังเป็นบวกทุกไตรมาส สิ่งที่ทำให้กรณีนี้ต่างออกไปคือ เมื่อคำนวณย้อนกลับจากราคา ตลาดฝังสมมติฐานว่ารายได้จะโตเพียง 12.4 เปอร์เซ็นต์ต่อปี ขณะที่บริษัทเพิ่งทำได้ 17.8 เปอร์เซ็นต์ พูดอีกอย่างคือราคานี้เรียกร้องน้อยกว่าที่บริษัททำอยู่ ไม่ใช่มากกว่า เราประเมินมูลค่าถ่วงน้ำหนักสามฉากทัศน์ได้ 341.70 ดอลลาร์ เทียบราคา 390.54 ดอลลาร์ คิดเป็นสัดส่วน 0.87 ซึ่งอยู่ในช่วงที่กรอบนี้เรียกว่าเหมาะสม ไม่ใช่ถูกและไม่ใช่แพงเกิน เราทดสอบสมมติฐานที่เปราะที่สุดคือความเร็วที่เงินลงทุนจะคลายตัว โดยไล่ตั้งแต่ระดับที่เป็นจริงในปีนี้ไปจนถึงระดับที่เอื้อเฟื้อที่สุด ผลออกมาอยู่ในช่วง 315 ถึง 357 ดอลลาร์ ทั้งตารางยังต่ำกว่าราคาตลาด ข้อสรุปจึงเป็นถือและรอจังหวะ ไม่ใช่ซื้อเพิ่ม เพราะผลตอบแทนคาดหวังในห้าปีอยู่ระหว่างติดลบ 2.6 ถึงบวก 6.0 เปอร์เซ็นต์ต่อปี ซึ่งต่ำกว่าต้นทุนของทุนที่ 10.2 เปอร์เซ็นต์ทั้งช่วง ธุรกิจดีเยี่ยมแต่ราคายังไม่ให้ส่วนเผื่อความปลอดภัย จุดที่กรอบนี้จะเปลี่ยนเป็นน่าสนใจคือราว 273 ดอลลาร์ หรือเมื่ออัตรากำไรพิสูจน์ว่ายืนเหนือ 44 เปอร์เซ็นต์ได้จริงผ่านคลื่นค่าเสื่อม ซึ่งงบไตรมาสวันที่ 28 ตุลาคมจะเป็นบททดสอบแรก",
      en: "Microsoft closed fiscal 2026 with revenue of $331.8B, up 18%, and operating profit of $155.2B, up 21% — profit growing faster than sales, in the year it spent more capital than ever before: $115.9B, up 80% in twelve months, or 35% of revenue. Azure grew 43% and passed $100B of annual revenue for the first time. Contracts signed but not yet recognised as revenue reached $678B, up 84%, roughly twice a full year of sales — a degree of forward visibility that is very rare. Return on invested capital is 31% against a 10.2% cost of capital, cash exceeds debt, and both S&P and Moody's award their top rating, something only two US public companies hold. We score quality 92 out of 100, the highest this framework has given. Yet the shares are down about 30% from their one-year high, because the market fears the spending will turn into depreciation that eats profit. That fear has substance: operating margin fell from 48.9% to 45.1% within four quarters, and free cash flow has declined two years running even while staying positive every quarter. What makes this case different is the reverse calculation: today's price embeds revenue growth of just 12.4% a year, against the 17.8% the company actually delivered. The price asks for less than the business is doing, not more. Our probability-weighted estimate is $341.70 against a price of $390.54, a ratio of 0.87 — what this framework calls fair: neither cheap nor badly expensive. We stress-tested the most fragile assumption, how quickly the capital spending eases, from this year's actual rate through to the most generous case; the results span $315 to $357 and the whole table sits below the market price. So the conclusion is hold and wait rather than add, because the five-year expected return runs from −2.6% to +6.0% a year, entirely below the 10.2% cost of capital. An excellent business, but the price offers no margin of safety yet. The framework turns interesting near $273, or when the margin proves it can hold above 44% through the depreciation wave — and the 28 October quarter is the first test.",
    },

    sources: [
      { label: "Microsoft Form 10-K ปีงบ 2026 (ยื่น 29 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/msft-20260630.htm" },
      { label: "8-K Exhibit 99.1 — ผลประกอบการ Q4/FY2026 (29 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/789019/000119312526323632/msft-ex99_1.htm" },
      { label: "SEC EDGAR XBRL Company Facts (CIK 0000789019)", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000789019.json" },
      { label: "Damodaran — Betas by Sector (Software System & Application, unlevered 1.25)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
      { label: "S&P ยืนยันอันดับ AAA outlook stable", url: "https://cbonds.com/news/2983723/" },
    ],
    pdfUrl: "/reports/msft-deep-o-v42.pdf",
  },
  {
    ticker: "INTC",
    company: "Intel Corporation",
    exchange: "NASDAQ",
    asOf: "2026-07-30",
    refPrice: 81.88,

    verdict: "trim",
    verdictEmoji: "🟠",
    verdictLabel: { th: "ลดน้ำหนัก", en: "Reduce" },
    quality: 57,
    confidence: 3,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "การพลิกกลับที่เพิ่งเริ่มได้เพียงไตรมาสเดียว จะขยายเป็นธุรกิจที่สร้างกระแสเงินสดราว 44 พันล้านดอลลาร์ต่อปีตลอดกาลได้หรือไม่ ซึ่งเป็นระดับที่มูลค่ากิจการ 441 พันล้านในวันนี้ต้องการ เทียบกับกำไรจากการดำเนินงานที่ดีที่สุดในประวัติศาสตร์ของบริษัทที่ราว 22 พันล้าน",
      en: "Can a turnaround that is one quarter old grow into a business generating roughly $44B a year of cash flow in perpetuity — the level a $441B enterprise value requires — against an all-time-best operating profit of about $22B?",
    },
    thesisOneSentence: {
      th: "Intel กำลังฟื้นจริงจากจุดที่เกือบตาย ด้วยเงินภาษีประชาชนและการเจือจางผู้ถือหุ้นเดิม 15.6 เปอร์เซ็นต์ในปีเดียว แต่ราคาที่ 82 ดอลลาร์ไม่ได้จ่ายค่าการฟื้นตัว มันจ่ายค่าการเป็นบริษัทที่ใหญ่กว่าอุตสาหกรรมทั้งอุตสาหกรรม",
      en: "Intel is genuinely recovering from near-death, funded by taxpayers and by diluting existing shareholders 15.6% in a single year — but at $82 the price is not paying for a recovery, it is paying for a company larger than its entire industry.",
    },

    business: {
      whatItDoes: {
        th: "Intel ออกแบบและผลิตชิปประมวลผลเอง ต่างจากคู่แข่งส่วนใหญ่ที่ออกแบบอย่างเดียวแล้วจ้างโรงงานอื่นผลิต รายได้หลักมาจากชิปสำหรับคอมพิวเตอร์ส่วนบุคคล รองลงมาคือชิปสำหรับศูนย์ข้อมูลและงาน AI ส่วนธุรกิจรับจ้างผลิตให้บริษัทอื่นยังอยู่ในช่วงเริ่มต้น",
        en: "Intel both designs and manufactures its own processors, unlike most rivals who design only and hire someone else to build. Most revenue comes from chips for personal computers, then chips for data centres and AI work. Its contract-manufacturing business for other companies is still early.",
      },
      revenueMix: [
        { label: { th: "ชิปคอมพิวเตอร์ส่วนบุคคล", en: "Personal computer chips" }, sharePct: 55 },
        { label: { th: "ชิปศูนย์ข้อมูลและ AI", en: "Data centre and AI chips" }, sharePct: 39 },
        { label: { th: "อื่น ๆ รวม Mobileye", en: "Other, including Mobileye" }, sharePct: 6 },
      ],
      moat: {
        th: "Intel เป็นบริษัทเดียวในสหรัฐที่ยังผลิตชิปขั้นสูงเองได้ทั้งกระบวนการ รัฐบาลสหรัฐจึงสนับสนุนเชิงยุทธศาสตร์ผ่านเงินอุดหนุนและการถือหุ้น แต่ในเชิงการแข่งขัน ส่วนแบ่งตลาดลดลงต่อเนื่องหลายปี และเทคโนโลยีการผลิตยังตามหลังผู้นำ",
        en: "Intel is the only US company still making advanced chips end to end, which is why the US government backs it strategically through subsidies and an equity stake. Competitively, though, its market share has fallen for years and its manufacturing technology still trails the leader.",
      },
      moatStrength: "narrow",
      strengths: [
        {
          th: "ไตรมาสล่าสุดรายได้โต 25% สูงสุดในรอบกว่าสิบห้าปี",
          en: "Revenue grew 25% last quarter, the fastest in over fifteen years.",
        },
        {
          th: "กำไรขั้นต้นเพิ่มจาก 27.5% เป็น 40.4% ภายในหนึ่งปี",
          en: "Gross margin rose from 27.5% to 40.4% within a year.",
        },
        {
          th: "รัฐบาลสหรัฐถือหุ้นและสนับสนุนผ่านกฎหมาย CHIPS",
          en: "The US government holds equity and backs it through the CHIPS Act.",
        },
      ],
      weaknesses: [
        {
          th: "รายได้หดสามปีติด และยังต่ำกว่าจุดสูงสุดปี 2021 อยู่ 33%",
          en: "Revenue fell three years running and is still 33% below its 2021 peak.",
        },
        {
          th: "กระแสเงินสดอิสระติดลบสามปีติดก่อนเพิ่งพลิกเป็นบวก",
          en: "Free cash flow was negative three years running before just turning positive.",
        },
        {
          th: "จำนวนหุ้นเพิ่ม 15.6% ในหนึ่งปี และยังทยอยเพิ่มต่อ",
          en: "The share count rose 15.6% in a year and keeps rising.",
        },
      ],
      competitors: ["TSMC", "AMD", "NVIDIA", "Samsung", "Qualcomm"],
    },
    businessRisks: [
      {
        risk: { th: "การฟื้นตัวเพิ่งเริ่มได้ไตรมาสเดียว", en: "The recovery is only one quarter old" },
        why: {
          th: "ไตรมาสล่าสุดดีขึ้นมาก แต่ก่อนหน้านั้นรายได้หดสามปีติดและขาดทุนจากการดำเนินงานหลายไตรมาส หนึ่งไตรมาสยังไม่พอบอกว่าเป็นแนวโน้ม",
          en: "The latest quarter improved sharply, but revenue had fallen three years running with operating losses in many quarters before it. One quarter does not make a trend.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "ธุรกิจรับจ้างผลิตยังไม่มีลูกค้าภายนอกรายใหญ่",
          en: "The contract-manufacturing arm has no large outside customer",
        },
        why: {
          th: "รายได้ส่วนนี้ 5.8 พันล้านในไตรมาส แต่รายได้รวมทั้งบริษัทมีเพียง 16.1 พันล้าน แปลว่าเกือบทั้งหมดคือการผลิตให้หน่วยงานของ Intel เอง ซึ่งถูกตัดออกเมื่อรวมงบและไม่ได้เพิ่มรายได้จริง",
          en: "That arm reported $5.8B in the quarter while the whole company had $16.1B, meaning almost all of it is building for Intel's own divisions — eliminated on consolidation and adding no outside revenue.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "จำนวนหุ้นเพิ่มขึ้นต่อเนื่อง ส่วนแบ่งของผู้ถือเดิมลดลง",
          en: "The share count keeps rising, shrinking existing holders' stake",
        },
        why: {
          th: "หุ้นเพิ่มจาก 4.36 พันล้านเป็น 5.04 พันล้านในหนึ่งปี และยังทยอยออกให้กระทรวงพาณิชย์สหรัฐต่อตามเงื่อนไขข้อตกลง ทุกหุ้นที่ออกใหม่ลดสัดส่วนกำไรต่อหุ้นของผู้ถือเดิม",
          en: "Shares went from 4.36 billion to 5.04 billion in a year, and more are released to the US Department of Commerce as the agreement's conditions are met. Every new share dilutes existing holders.",
        },
        kind: "financial",
      },
      {
        risk: { th: "ต้นทุนการกู้ยืมสูงและถูกล็อกไว้ยาว", en: "Borrowing costs are high and locked in for decades" },
        why: {
          th: "หุ้นกู้ที่ออกใหม่ในไตรมาสมีดอกเบี้ยถึง 6.13 และ 6.20 เปอร์เซ็นต์ ครบกำหนดปี 2056 และ 2066 พร้อมกับวงเงินสำรองที่ถูกลดจาก 5 พันล้านเหลือ 3 พันล้าน และอันดับเครดิตอยู่เหนือระดับต่ำกว่าลงทุนเพียงสองขั้น",
          en: "Notes issued this quarter carry rates up to 6.13% and 6.20%, maturing in 2056 and 2066, while the backup credit line was cut from $5B to $3B. The credit rating sits just two notches above sub-investment grade.",
        },
        kind: "financial",
      },
      {
        risk: { th: "ยังเสียส่วนแบ่งตลาดให้คู่แข่ง", en: "It is still losing share to competitors" },
        why: {
          th: "รายได้ปัจจุบันยังต่ำกว่าจุดสูงสุดปี 2021 อยู่หนึ่งในสาม ขณะที่คู่แข่งทั้งฝั่งออกแบบชิปและฝั่งโรงงานเติบโตในช่วงเดียวกัน",
          en: "Revenue remains a third below its 2021 peak while competitors on both the design and manufacturing side grew over the same period.",
        },
        kind: "competition",
      },
    ],

    valuation: {
      bear: -0.1,
      base: 9.22,
      bull: 23.25,
      ev: 10.63,
      bearP: 0.3,
      baseP: 0.4,
      bullP: 0.3,
      trigger: 8.5,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "เมื่อคำนวณย้อนกลับจากราคา 81.88 ดอลลาร์ ตลาดฝังสมมติฐานว่ารายได้จะโต 37.8 เปอร์เซ็นต์ต่อปีต่อเนื่องสิบปี จนแตะ 1.4 ล้านล้านดอลลาร์ในปี 2036 ตลาดกำลังตีราคาว่าธุรกิจรับจ้างผลิตของ Intel จะกลายเป็นทางเลือกที่สองของ TSMC อย่างมีนัยสำคัญ โดยมีรัฐบาลสหรัฐหนุนหลังเชิงยุทธศาสตร์ และเทคโนโลยี 18A จะดึงลูกค้าภายนอกเข้ามาได้จริง",
        en: "Reversed out of the $81.88 price, the market embeds revenue growth of 37.8% a year for a decade, reaching $1.4 trillion by 2036. It is pricing Intel's contract-manufacturing arm as a meaningful second source to TSMC, backed strategically by the US government, with the 18A process winning real outside customers.",
      },
      us: {
        th: "เรามองการเติบโตราว 6 เปอร์เซ็นต์ต่อปีโดยเฉลี่ย และอัตรากำไรจากการดำเนินงานระยะยาวที่ 15 เปอร์เซ็นต์ ซึ่งยังต่ำกว่าจุดสูงสุดในประวัติศาสตร์ที่ 22 เปอร์เซ็นต์ เหตุผลคือขนาดที่ราคาต้องการเป็นไปไม่ได้เชิงเลขคณิต รายได้ 1.4 ล้านล้านคือราวสองเท่าของอุตสาหกรรมเซมิคอนดักเตอร์ทั้งโลกในวันนี้ และเราใส่การเจือจางต่อเนื่องไว้ในทุกฉากทัศน์ เพราะข้อตกลงกับรัฐยังทยอยออกหุ้นเพิ่ม",
        en: "We model about 6% average annual growth and a 15% long-run operating margin, still below the 22% all-time best. The reason is arithmetic: $1.4 trillion of revenue is roughly twice today's entire world semiconductor industry. We also build continuing dilution into every scenario, because the government agreement keeps issuing shares.",
      },
    },

    killers: [
      {
        th: "กำไรจากการดำเนินงานตามบัญชีปกติยืนเหนือ 10 เปอร์เซ็นต์ สองไตรมาสติด",
        en: "GAAP operating margin holds above 10% for two consecutive quarters",
      },
      {
        th: "Intel แยกตัวเลขรายได้จากการรับจ้างผลิตให้ลูกค้าภายนอก และเกิน 2 พันล้านต่อไตรมาส",
        en: "Intel breaks out external foundry revenue and it exceeds $2B a quarter",
      },
      {
        th: "กระแสเงินสดอิสระเป็นบวกสองไตรมาสติด",
        en: "Free cash flow is positive for two consecutive quarters",
      },
      {
        th: "จำนวนหุ้นทรงตัวต่ำกว่า 5.2 พันล้าน แปลว่าการเจือจางจบแล้ว",
        en: "The share count holds below 5.2 billion, meaning dilution has ended",
      },
      {
        th: "อันดับเครดิตถูกปรับขึ้น หรือมุมมองเปลี่ยนเป็นบวก",
        en: "The credit rating is upgraded, or the outlook turns positive",
      },
    ],
    catalysts: [
      { when: { th: "~22 ต.ค. 2026", en: "~Oct 22, 2026" }, what: {
        th: "งบไตรมาส 3 จะบอกว่าไตรมาสที่แล้วเป็นแนวโน้มหรืออุบัติเหตุ ทั้งอัตรากำไรและกระแสเงินสด",
        en: "Q3 results show whether last quarter was a trend or an accident, on both margin and cash flow",
      } },
      { when: { th: "~22 ม.ค. 2027", en: "~Jan 22, 2027" }, what: {
        th: "งบทั้งปีและรายงานประจำปี พร้อมตารางครบกำหนดหนี้ห้าปีที่ยังไม่เคยเปิดเผย",
        en: "Full-year results and the annual report, including the five-year debt maturity table not yet disclosed",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "ความคืบหน้าของเทคโนโลยีการผลิต 18A ซึ่ง Moody's ระบุเองว่าเป็นตัวชี้ขาดอันดับเครดิต",
        en: "Progress on the 18A process, which Moody's itself calls the decider for the credit rating",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "การทยอยส่งมอบหุ้นให้กระทรวงพาณิชย์สหรัฐตามข้อตกลง",
        en: "The continuing release of shares to the US Department of Commerce under the agreement",
      } },
    ],
    returnMath: {
      floorPct: "−33.5%",
      onTrackPct: "−25.5%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่งแล้วราคาไล่ลงมาหา ส่วน on-track คือมูลค่าโตปีละ 12 เปอร์เซ็นต์ระหว่างที่ราคาปิดช่องว่าง Intel ไม่จ่ายปันผล ตัวเลขติดลบระดับนี้สะท้อนว่าช่องว่างระหว่างราคากับมูลค่าที่ประเมินได้ใหญ่มาก และต้องอ่านคู่กับข้อจำกัด แม้ในฉากที่ดีที่สุดของเราที่ 23.25 ดอลลาร์ ก็ยังต่ำกว่าราคาปัจจุบันมาก ซึ่งบอกว่าปัญหาไม่ได้อยู่ที่ฉากทัศน์ใดฉากหนึ่ง แต่อยู่ที่ระดับราคาเอง นี่ไม่ใช่ราคาเป้าหมาย",
        en: "These assume the price reverts to the estimate within five years — floor is value standing still while price falls to meet it, on-track is value compounding 12% a year as the gap closes. Intel pays no dividend. Losses of this size reflect how large the gap is, and should be read with the caveats: even our best case at $23.25 sits far below today's price, which says the problem is not any single scenario but the price level itself. This is not a price target.",
      },
    },

    sensitivity: {
      rowLabel: {
        th: "สมมติฐานที่ต้องเป็นจริง ไล่จากฐานขึ้นไป",
        en: "Assumptions that must hold, stacked from the base upward",
      },
      colLabel: { th: "มูลค่าที่ได้", en: "Resulting value" },
      rows: ["Base เดิม", "WACC 9% + ภาษี 0% ตลอดกาล", "+ อัตรากำไร 22% เท่ายุคทอง", "+ โต 15% ยาว 5 ปี", "+ โต 20% ยาว 7 ปี อัตรากำไร 25%"],
      cols: ["มูลค่า/หุ้น"],
      grid: [
        [12],
        [24],
        [40],
        [57],
        [95],
      ],
      baseRow: 0,
      baseCol: 0,
      caption: {
        th: "แต่ละแถวคือการเพิ่มสมมติฐานที่เอื้อบริษัทเข้าไปทีละชั้น โดยยังคงสมมติฐานของแถวก่อนหน้าไว้ทั้งหมด มีเพียงแถวสุดท้ายที่เกินราคาตลาด 81.88 ดอลลาร์ และแถวนั้นต้องการพร้อมกันทั้งการไม่เสียภาษีเลยตลอดกาล อัตรากำไร 25 เปอร์เซ็นต์ซึ่งสูงกว่าที่ Intel เคยทำได้ในยุคที่ผูกขาดตลาด และการเติบโต 20 เปอร์เซ็นต์ต่อปีเจ็ดปีจนรายได้แตะ 222 พันล้าน ทั้งที่ผู้บริหารการเงินเพิ่งประกาศว่าจะเพิ่มการลงทุนอย่างมีนัยสำคัญ",
        en: "Each row adds one more company-favourable assumption while keeping all the rows above it. Only the last clears the $81.88 price, and it requires simultaneously paying no tax ever, a 25% operating margin above anything Intel achieved even when it dominated the market, and 20% annual growth for seven years to $222B of revenue — while the CFO has just said spending will rise meaningfully.",
      },
    },

    onePager: {
      th: "Intel เพิ่งรายงานไตรมาสที่ดีที่สุดในรอบหลายปี รายได้ 16.1 พันล้านดอลลาร์ เพิ่มขึ้น 25 เปอร์เซ็นต์จากปีก่อน ซึ่งบริษัทระบุว่าเป็นการเติบโตที่แรงที่สุดในรอบกว่าสิบห้าปี กำไรขั้นต้นเพิ่มจาก 27.5 เป็น 40.4 เปอร์เซ็นต์ และกำไรจากการดำเนินงานพลิกจากติดลบ 24.7 เปอร์เซ็นต์เป็นบวก 11.1 เปอร์เซ็นต์ ผู้บริหารการเงินอธิบายว่ามาจากอัตราของดีที่ผลิตได้สูงขึ้นและรอบการผลิตสั้นลง ซึ่งเป็นเหตุผลเชิงปฏิบัติการ ไม่ใช่รายการพิเศษ ตัวเลขที่ดูน่าตกใจคือขาดทุนสุทธิ 11 พันล้าน แต่เกือบทั้งก้อนไม่ใช่ของจริง มันคือการตีมูลค่าใหม่ของหุ้นที่ Intel วางไว้ในบัญชีเอสโครว์เพื่อทยอยส่งมอบให้กระทรวงพาณิชย์สหรัฐตามข้อตกลงกฎหมาย CHIPS ซึ่งบันทึกเป็นหนี้สินอนุพันธ์ พอราคาหุ้นขึ้น หนี้สินก้อนนี้ก็โตและกลายเป็นขาดทุนทางบัญชี 12.5 พันล้าน พูดง่าย ๆ คือ Intel ขาดทุนเพราะหุ้นตัวเองขึ้น ถ้าตัดรายการนี้ออก บริษัทมีกำไร 2.2 พันล้านในไตรมาส และไตรมาสหน้าคาดว่ากำไรต่อหุ้นจะเป็นบวกแม้ในฐานบัญชีปกติ เราให้คะแนนคุณภาพ 57 เต็ม 100 อยู่ระดับกลาง ปัญหาอยู่ที่ราคา ที่ 81.88 ดอลลาร์ มูลค่ากิจการรวมหนี้อยู่ที่ 441 พันล้าน ซึ่งต้องการกระแสเงินสดราว 44 พันล้านต่อปีตลอดกาลจึงจะคุ้มที่ต้นทุนเงินทุน 10 เปอร์เซ็นต์ ขณะที่กำไรจากการดำเนินงานที่ดีที่สุดในประวัติศาสตร์ของ Intel คือราว 22 พันล้าน เมื่อคำนวณย้อนกลับ ราคานี้ฝังสมมติฐานว่ารายได้จะโต 37.8 เปอร์เซ็นต์ต่อปีต่อเนื่องสิบปี จนแตะ 1.4 ล้านล้านดอลลาร์ ซึ่งใหญ่กว่าอุตสาหกรรมเซมิคอนดักเตอร์ทั้งโลกราวสองเท่า เราทดสอบด้วยการดันทุกสมมติฐานไปทางบวกจนเกินจริง คือไม่เสียภาษีเลยตลอดกาล อัตรากำไร 25 เปอร์เซ็นต์ซึ่งสูงกว่าที่เคยทำได้ในยุคผูกขาด และโต 20 เปอร์เซ็นต์ต่อปีเจ็ดปี ได้มูลค่า 95 ดอลลาร์ ซึ่งเพิ่งจะเกินราคาตลาด แต่ต้องเป็นจริงพร้อมกันทุกข้อ นอกจากนี้โมดูลเครดิตของกรอบนี้ทำงาน เพราะเงินลงทุนคิดเป็น 81 เปอร์เซ็นต์ของกระแสเงินสดจากการดำเนินงาน พร้อมกับที่หนี้รวมเพิ่มจาก 46.6 พันล้านเมื่อสิ้นปีงบ 2025 เป็น 50.5 พันล้านในเดือนมิถุนายน 2026 พูดให้ชัดคือบริษัทกำลังกู้มาสร้างโรงงาน ไม่ใช่สร้างจากกำไรตัวเอง ส่วนหนี้สุทธิเองอยู่ที่ 20.8 พันล้าน หรือ 1.7 เท่าของกำไรก่อนดอกเบี้ยภาษีค่าเสื่อม ซึ่งเป็นระดับปกติ ไม่ใช่ระดับวิกฤต Moody's ลดอันดับเป็น Baa2 และ S&P เป็น BBB ทั้งคู่มุมมองมีเสถียรภาพ แต่ห่างจากระดับต่ำกว่าลงทุนเพียงสองขั้น หุ้นกู้ที่เพิ่งออกมีดอกเบี้ยถึง 6.2 เปอร์เซ็นต์ครบกำหนดปี 2066 และวงเงินสำรองถูกลดจาก 5 พันล้านเหลือ 3 พันล้าน ข้อสรุปคือลดน้ำหนัก ไม่ใช่ขาย เพราะการฟื้นตัวเป็นเรื่องจริงและมีรัฐบาลสหรัฐหนุนหลัง แต่ราคาปัจจุบันไม่ได้จ่ายค่าการฟื้นตัว มันจ่ายค่าการเป็นบริษัทที่ใหญ่กว่าทั้งอุตสาหกรรม และผู้ถือเดิมยังต้องรับการเจือจางต่อเนื่อง เพราะหุ้นเพิ่มขึ้น 15.6 เปอร์เซ็นต์ในหนึ่งปีและยังทยอยออกให้รัฐต่อ",
      en: "Intel just reported its best quarter in years: revenue of $16.1B, up 25% year on year, which the company calls its strongest growth in over fifteen years. Gross margin rose from 27.5% to 40.4% and operating margin swung from −24.7% to +11.1%, with the CFO attributing it to higher factory yields and shorter cycle times — operational reasons, not one-offs. The alarming figure is the $11B net loss, but almost none of it is real. It is a revaluation of shares Intel holds in escrow for gradual release to the US Department of Commerce under the CHIPS Act, booked as a derivative liability. When the share price rises, that liability grows, producing a $12.5B accounting loss. In plain terms, Intel booked a loss because its own stock went up. Strip it out and the company earned $2.2B in the quarter, and it guides next quarter to positive earnings per share even on a reported basis. We score quality 57 out of 100, in the middle band. The problem is the price. At $81.88 the enterprise value including debt is $441B, which needs roughly $44B a year of cash flow in perpetuity to justify at a 10% cost of capital — against an all-time-best operating profit of about $22B. Reversing the arithmetic, this price embeds 37.8% annual revenue growth for a decade, reaching $1.4 trillion, roughly twice the entire world semiconductor industry. We stress-tested by pushing every assumption implausibly in the company's favour — no tax ever, a 25% margin above anything achieved even when it dominated, 20% growth for seven years — and reached $95, only just above the market price, and only with all of it true at once. The framework's credit module also triggered: capital spending is 81% of operating cash flow while total debt rose from $46.6B at the fiscal 2025 year end to $50.5B by June 2026 — the company is borrowing to build its factories rather than funding them from its own profits. Net debt itself is $20.8B, or 1.7 times EBITDA, which is an ordinary level rather than a distressed one. Moody's cut the rating to Baa2 and S&P to BBB, both stable, but only two notches above sub-investment grade. Notes issued this quarter carry up to 6.2% maturing in 2066, and the backup credit line was cut from $5B to $3B. The conclusion is reduce, not sell, because the recovery is real and the US government is behind it — but today's price is not paying for a recovery, it is paying for a company larger than the whole industry, and existing holders keep absorbing dilution as shares are released to the government.",
    },

    sources: [
      { label: "Intel Form 10-Q งวด 27 มิ.ย. 2026 (ยื่น 24 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/50863/000005086326000157/intc-20260627.htm" },
      { label: "8-K Exhibit 99.1 — ผลประกอบการ Q2 2026 (23 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/50863/000005086326000155/q226earningsrelease.htm" },
      { label: "SEC EDGAR XBRL Company Facts (CIK 0000050863)", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000050863.json" },
      { label: "Damodaran — Betas by Sector (Semiconductor, unlevered 1.50)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
      { label: "Moody's ลดอันดับ Intel เป็น Baa2 มุมมองมีเสถียรภาพ", url: "https://www.investing.com/news/stock-market-news/intel-downgraded-by-moodys-to-baa2-on-weak-profitability-outlook-93CH-4186211" },
    ],
    pdfUrl: "/reports/intc-deep-o-v42.pdf",
  },
  {
    ticker: "UNH",
    company: "UnitedHealth Group Incorporated",
    exchange: "NYSE",
    asOf: "2026-07-30",
    refPrice: 420.57,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ", en: "Hold" },
    quality: 68,
    confidence: 3,
    uncertainty: "HIGH",

    oneQuestion: {
      th: "UnitedHealth จะรักษาอัตรากำไรสุทธิที่ราว 5 เปอร์เซ็นต์ซึ่งเพิ่งกลับมาได้หรือไม่ ทั้งที่จำนวนผู้เอาประกันกำลังลดลงในทุกกลุ่ม วัดด้วยสัดส่วนค่ารักษาต่อเบี้ยประกัน ซึ่งไตรมาสล่าสุดอยู่ที่ 86.7 เปอร์เซ็นต์ จาก 89.4 เปอร์เซ็นต์ปีก่อน",
      en: "Can UnitedHealth hold the roughly 5% net margin it has just recovered, while membership shrinks in every category? Measured by the medical care ratio, which was 86.7% last quarter against 89.4% a year earlier.",
    },
    thesisOneSentence: {
      th: "UnitedHealth ซ่อมกำไรของตัวเองสำเร็จภายในสองไตรมาสด้วยการขึ้นราคาและตัดสมาชิกที่ขาดทุนทิ้ง ราคาหุ้นวันนี้จ่ายค่าการซ่อมนั้นครบพอดี และคำถามที่เหลือคือบริษัทจะโตต่อจากฐานที่เล็กลงได้อย่างไร",
      en: "UnitedHealth repaired its own profitability in two quarters by raising prices and shedding loss-making members. Today's price pays for that repair almost exactly, and the open question is how it grows from a smaller base.",
    },

    business: {
      whatItDoes: {
        th: "UnitedHealth ทำสองธุรกิจที่เกี่ยวเนื่องกัน หนึ่งคือขายประกันสุขภาพให้บุคคล นายจ้าง และโครงการของรัฐอย่าง Medicare กับ Medicaid โดยเก็บเบี้ยแล้วจ่ายค่ารักษาแทน สองคือ Optum ซึ่งให้บริการด้านสุขภาพ ระบบข้อมูล และบริหารสิทธิประโยชน์ยา ทั้งให้บริษัทแม่และลูกค้าอื่น",
        en: "UnitedHealth runs two connected businesses. One sells health insurance to individuals, employers and government programmes such as Medicare and Medicaid, collecting premiums and paying medical bills. The other, Optum, provides care services, data systems and pharmacy benefit management, both to its parent and to outside clients.",
      },
      revenueMix: [
        { label: { th: "ประกัน Medicare และผู้เกษียณ", en: "Medicare and retirement insurance" }, sharePct: 38 },
        { label: { th: "Optum ส่วนที่ขายให้ลูกค้าภายนอก", en: "Optum, external customers only" }, sharePct: 23 },
        { label: { th: "ประกันโครงการรัฐ Medicaid", en: "Medicaid programmes" }, sharePct: 21 },
        { label: { th: "ประกันนายจ้างและบุคคล", en: "Employer and individual insurance" }, sharePct: 18 },
      ],
      moat: {
        th: "UnitedHealth ดูแลผู้เอาประกัน 48.5 ล้านคนและมีเครือข่ายแพทย์กับโรงพยาบาลที่ใหญ่ที่สุดในสหรัฐ ขนาดนี้ทำให้ต่อรองราคาค่ารักษาได้ดีกว่ารายเล็ก และการที่ Optum เป็นทั้งผู้ให้บริการและผู้จ่ายเงินทำให้เห็นต้นทุนจริงทั้งสองด้าน แต่ธุรกิจนี้อยู่ใต้การกำกับของรัฐทั้งเรื่องราคาและกำไร",
        en: "UnitedHealth covers 48.5 million members and runs the largest network of doctors and hospitals in the US, which lets it negotiate medical prices better than smaller rivals. Because Optum both delivers care and pays for it, the company sees true costs from both sides. But the state regulates both its prices and its profits.",
      },
      moatStrength: "narrow",
      strengths: [
        {
          th: "ผลตอบแทนต่อส่วนของผู้ถือหุ้น 16% สูงกว่าต้นทุนเงินทุนราวสองเท่า",
          en: "Return on equity of 16%, about twice its cost of capital.",
        },
        {
          th: "กำไรจากการดำเนินงานไตรมาสล่าสุดเพิ่ม 55% และบริษัทปรับเป้าทั้งปีขึ้น",
          en: "Operating profit rose 55% last quarter and full-year guidance was raised.",
        },
        {
          th: "Optum Insight มีอัตรากำไรจากการดำเนินงาน 25.3 เปอร์เซ็นต์",
          en: "Optum Insight earns a 25.3% operating margin.",
        },
      ],
      weaknesses: [
        {
          th: "ผู้เอาประกันลดลง 1.59 ล้านคนในหนึ่งปี Medicare Advantage หายไป 9.4%",
          en: "Membership fell 1.59 million in a year; Medicare Advantage lost 9.4%.",
        },
        {
          th: "กำไรสุทธิลดลงสองปีติด จาก 22.4 พันล้านเหลือ 12.1 พันล้าน",
          en: "Net profit fell two years running, from $22.4B to $12.1B.",
        },
        {
          th: "อัตราค่ารักษาที่ดีขึ้นมีการปรับสำรองงวดก่อน 860 ล้านช่วยอยู่",
          en: "The improved medical ratio was helped by $860M of prior-period reserve releases.",
        },
      ],
      competitors: ["Elevance Health", "CVS Health", "Cigna", "Humana", "Centene"],
    },
    businessRisks: [
      {
        risk: {
          th: "ค่ารักษาพยาบาลอาจกลับมาสูงเกินที่ตั้งราคาไว้อีก",
          en: "Medical costs could again outrun the prices charged",
        },
        why: {
          th: "นี่คือสิ่งที่ทำให้กำไรของบริษัทเกือบหายไปทั้งหมดในปี 2025 สัดส่วนค่ารักษาต่อเบี้ยเคลื่อนไหวเพียงหนึ่งจุดก็กระทบกำไรราวสี่พันห้าร้อยล้านดอลลาร์",
          en: "This is what almost erased the company's profit in 2025. A single percentage point on the medical care ratio moves profit by roughly $4.5 billion.",
        },
        kind: "execution",
      },
      {
        risk: { th: "จำนวนผู้เอาประกันกำลังลดลงทุกกลุ่ม", en: "Membership is falling in every category" },
        why: {
          th: "ลดลง 1.59 ล้านคนในหนึ่งปี โดยกลุ่ม Medicare Advantage ซึ่งทำกำไรดีหายไป 9.4 เปอร์เซ็นต์ ฐานที่เล็กลงทำให้อำนาจต่อรองค่ารักษาและการกระจายความเสี่ยงลดลง",
          en: "Down 1.59 million in a year, with the profitable Medicare Advantage book shrinking 9.4%. A smaller base weakens both bargaining power over medical prices and risk pooling.",
        },
        kind: "concentration",
      },
      {
        risk: {
          th: "กำไรที่กลับมามีการปรับสำรองงวดก่อนช่วยอยู่",
          en: "The profit recovery was helped by prior-period reserve releases",
        },
        why: {
          th: "สัดส่วนค่ารักษาที่ดีขึ้นในไตรมาสล่าสุดรวมผลบวก 860 ล้านดอลลาร์จากการปรับประมาณการค่ารักษาของงวดก่อน ซึ่งไม่ใช่ผลการดำเนินงานของไตรมาสนั้นเอง",
          en: "The improved medical care ratio last quarter included an $860 million benefit from revising earlier periods' cost estimates, which is not the quarter's own performance.",
        },
        kind: "financial",
      },
      {
        risk: {
          th: "อยู่ระหว่างถูกสอบสวนโดยกระทรวงยุติธรรมสหรัฐ",
          en: "Under investigation by the US Department of Justice",
        },
        why: {
          th: "ทั้งทางแพ่งและอาญา เกี่ยวกับการเบิกจ่ายในโครงการ Medicare ซึ่งบริษัทจัดอันดับเครดิตระบุเป็นหนึ่งในเหตุผลที่ยังคงมุมมองเครดิตเป็นลบ",
          en: "Both civil and criminal, over Medicare billing. Credit rating agencies cite it as one reason their outlook on the company remains negative.",
        },
        kind: "regulation",
      },
      {
        risk: { th: "รัฐกำกับทั้งราคาและกำไรของธุรกิจนี้", en: "The state regulates both prices and profits" },
        why: {
          th: "บริษัทประกาศคืนกำไรจากแผนประกันตามกฎหมาย ACA ให้สมาชิกราวหนึ่งล้านคนในปี 2026 โดยสมัครใจ ซึ่งแสดงว่าเพดานกำไรของธุรกิจนี้ไม่ได้ถูกกำหนดโดยตลาดเพียงอย่างเดียว",
          en: "The company has voluntarily committed to rebating its profit on ACA plans to about a million members in 2026, which shows the ceiling on profit here is not set by the market alone.",
        },
        kind: "regulation",
      },
    ],

    valuation: {
      bear: 258.51,
      base: 407.67,
      bull: 573.46,
      ev: 420.12,
      bearP: 0.25,
      baseP: 0.45,
      bullP: 0.3,
      trigger: 336.1,
      verdictWord: { th: "มูลค่าเหมาะสม", en: "Fair Value" },
    },

    variant: {
      market: {
        th: "เมื่อคำนวณย้อนกลับจากราคา 420.57 ดอลลาร์ ตลาดฝังสมมติฐานว่าอัตรากำไรสุทธิจะอยู่ที่ 4.97 เปอร์เซ็นต์ตลอดสิบปี ซึ่งเท่ากับที่ไตรมาสล่าสุดทำได้พอดีที่ 4.9 สูงกว่าเป้าทั้งปีที่ราว 3.7 และต่ำกว่าระดับก่อนวิกฤตปี 2023 ที่ 6.0 พูดง่าย ๆ คือตลาดเชื่อว่าไตรมาสล่าสุดคือระดับปกติใหม่",
        en: "Reversed out of the $420.57 price, the market embeds a 4.97% net margin for a decade. That is exactly what last quarter delivered at 4.9%, above the full-year guide of roughly 3.7%, and below the 6.0% of 2023 before the crisis. In short, the market treats last quarter as the new normal.",
      },
      us: {
        th: "เรามองอัตรากำไรสุทธิระยะยาวที่ 5.0 เปอร์เซ็นต์ ซึ่งแทบไม่ต่างจากตลาด และต้องบอกตรง ๆ ว่ารายงานนี้ไม่มีมุมมองที่ต่างจากตลาดอย่างมีนัย มีแต่กรอบเรื่องราคาและจังหวะ สิ่งที่เราเน้นต่างออกไปคือการเติบโต เพราะกำไรที่กลับมาไม่ได้มาจากการขยายธุรกิจ แต่มาจากการขึ้นราคาและตัดลูกค้าที่ขาดทุนทิ้ง ซึ่งเป็นวิธีที่ใช้ได้ครั้งเดียว",
        en: "We model a 5.0% long-run net margin, essentially the market's number, and we state plainly that this report carries no meaningful variant view — only a framework on price and timing. Where we do differ in emphasis is growth: the profit recovery came from raising prices and shedding loss-making customers, not from expansion, and that is a one-time source.",
      },
    },

    killers: [
      {
        th: "สัดส่วนค่ารักษาต่อเบี้ยต่ำกว่า 88 เปอร์เซ็นต์ สองไตรมาสติด",
        en: "The medical care ratio stays below 88% for two consecutive quarters",
      },
      {
        th: "จำนวนผู้เอาประกันกลับมาโต หรืออย่างน้อยหยุดหดที่ราว 48 ล้านคน",
        en: "Membership returns to growth, or at least stops shrinking near 48 million",
      },
      { th: "Moody's คืนมุมมองเครดิตเป็นมีเสถียรภาพ", en: "Moody's restores its credit outlook to stable" },
      {
        th: "กำไรต่อหุ้นทั้งปี 2026 เกิน 18.95 ดอลลาร์ ซึ่งเหนือขอบบนของเป้าที่เพิ่งขึ้นมา",
        en: "FY2026 earnings per share exceed $18.95, above the top of the freshly raised guidance",
      },
      {
        th: "คดีของกระทรวงยุติธรรมยุติโดยไม่มีบทลงโทษเชิงโครงสร้าง",
        en: "The Department of Justice case is settled with no structural remedy",
      },
    ],
    catalysts: [
      { when: { th: "~14 ต.ค. 2026", en: "~Oct 14, 2026" }, what: {
        th: "งบไตรมาส 3 ตัดสินทั้งสัดส่วนค่ารักษาและจำนวนสมาชิกพร้อมกัน และเป็นไตรมาสแรกของครึ่งปีหลังที่กำไรตามฤดูกาลจะอ่อนลง",
        en: "Q3 results settle both the medical care ratio and the membership count, and it is the first half-two quarter when profit seasonally weakens",
      } },
      { when: { th: "ต.ค. 2026", en: "Oct 2026" }, what: {
        th: "ฤดูลงทะเบียน Medicare Advantage จะบอกว่าฐานสมาชิกปี 2027 หยุดหดหรือไม่",
        en: "Medicare Advantage enrolment season shows whether the 2027 member base stops shrinking",
      } },
      { when: { th: "~ม.ค. 2027", en: "~Jan 2027" }, what: { th: "งบทั้งปี 2026 และเป้าหมายปี 2027", en: "Full-year 2026 results and 2027 guidance" } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "ความคืบหน้าคดีกระทรวงยุติธรรม และการทบทวนมุมมองเครดิตของ Moody's",
        en: "Progress on the Justice Department case and Moody's review of its outlook",
      } },
    ],
    returnMath: {
      floorPct: "0.0%",
      onTrackPct: "+5.1%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคาเคลื่อนเข้าหามูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่ง ส่วน on-track คือมูลค่าโตปีละ 5.1 เปอร์เซ็นต์ ซึ่งเป็นต้นทุนส่วนของผู้ถือหุ้นหักผลตอบแทนที่คืนให้ผู้ถือหุ้นราว 3.3 เปอร์เซ็นต์จากปันผลและการซื้อหุ้นคืน จุดสำคัญคือช่วงตั้งแต่ศูนย์ถึงบวก 5.1 อยู่ใต้ต้นทุนส่วนของผู้ถือหุ้นที่ 8.4 เปอร์เซ็นต์ทั้งช่วง แปลว่าที่ราคานี้ผลตอบแทนคาดหวังยังไม่ชดเชยความเสี่ยง ต่างจากกรณีอื่นตรงที่ขอบล่างอยู่ที่ศูนย์พอดี ไม่ติดลบ เพราะราคากับมูลค่าเท่ากันแทบเป๊ะ นี่ไม่ใช่ราคาเป้าหมาย",
        en: "These assume the price moves toward the estimate within five years — floor is value standing still, on-track is value compounding 5.1% a year, being the 8.4% cost of equity less roughly 3.3% returned through dividends and buybacks. The point is that the whole range, zero to +5.1%, sits below the 8.4% cost of equity, so the expected return does not yet compensate for the risk. Unlike other cases the floor is exactly zero rather than negative, because price and value are almost identical. This is not a price target.",
      },
    },

    sensitivity: {
      rowLabel: { th: "อัตรากำไรสุทธิระยะยาว", en: "Long-run net margin" },
      colLabel: { th: "การเติบโตของรายได้ในช่วงแรก", en: "Revenue growth in the early years" },
      rows: ["6.0% (ระดับปี 2023)", "5.0% (Base)", "4.0%", "3.6% (ระดับ guidance)"],
      cols: ["1%", "5% (Base)", "8%"],
      grid: [
        [419, 493, 561],
        [345, 408, 464],
        [274, 324, 369],
        [246, 291, 331],
      ],
      baseRow: 1,
      baseCol: 1,
      caption: {
        th: "สองแกนนี้คือสิ่งที่ตัดสินหุ้นตัวนี้จริง ๆ คืออัตรากำไรที่รักษาได้และการเติบโตของฐานสมาชิก ราคาตลาด 420.57 ดอลลาร์ตรงกับช่องบนซ้ายพอดี ซึ่งคือกำไรกลับสู่ระดับปี 2023 ที่ 6 เปอร์เซ็นต์แต่แทบไม่โตเลย หรือช่องกลางที่กำไร 5 เปอร์เซ็นต์กับการเติบโต 5 เปอร์เซ็นต์ ทั้งสองทางให้มูลค่าใกล้เคียงราคาปัจจุบัน จึงเป็นเหตุผลที่ผลออกมาว่าเหมาะสม กรอบเข้ม = Base",
        en: "These two axes are what actually decide this stock: the margin it can sustain and whether the member base grows. The $420.57 price matches the top-left cell — margins back to the 6% of 2023 but almost no growth — and also the centre cell of 5% margin with 5% growth. Both routes land near today's price, which is why the reading is fair. Bold box = Base.",
      },
    },

    onePager: {
      th: "UnitedHealth ผ่านปีที่เลวร้ายที่สุดในประวัติศาสตร์บริษัทมาแล้ว กำไรจากการดำเนินงานตกจากราวแปดเปอร์เซ็นต์ของรายได้เหลือ 0.3 เปอร์เซ็นต์ในไตรมาสสุดท้ายของปี 2025 เพราะตั้งราคาเบี้ยประกันต่ำกว่าค่ารักษาที่เกิดขึ้นจริง จากนั้นบริษัทซ่อมตัวเองได้ในสองไตรมาส ไตรมาสแรกปี 2026 กำไรจากการดำเนินงานกลับมาที่แปดเปอร์เซ็นต์ และไตรมาสสองอยู่ที่ 7.1 เปอร์เซ็นต์ หรือแปดพันล้านดอลลาร์ เพิ่มขึ้น 55 เปอร์เซ็นต์จากปีก่อน สัดส่วนค่ารักษาต่อเบี้ยลดจาก 89.4 เหลือ 86.7 เปอร์เซ็นต์ และบริษัทปรับเป้าทั้งปีขึ้นทุกบรรทัด กำไรต่อหุ้นจากเดิมมากกว่า 17.10 ดอลลาร์เป็น 18.45 ถึง 18.95 ดอลลาร์ กระแสเงินสดจาก 18 พันล้านเป็นราว 24 พันล้าน และเพิ่มการซื้อหุ้นคืนจากสองพันห้าร้อยล้านเป็นอย่างน้อยห้าพันล้าน ผลตอบแทนต่อส่วนของผู้ถือหุ้นอยู่ที่ 16 เปอร์เซ็นต์ เทียบต้นทุนส่วนของผู้ถือหุ้น 8.4 เปอร์เซ็นต์ เราให้คะแนนคุณภาพ 68 เต็ม 100 ซึ่งต่ำกว่าเส้นชั้นสูงเพียงสองคะแนน สิ่งที่กดคะแนนคือด้านความต้องการ เพราะบริษัทกำลังเล็กลง จำนวนผู้เอาประกันลดจาก 50.1 ล้านคนเหลือ 48.5 ล้านคนในหนึ่งปี กลุ่ม Medicare Advantage ซึ่งทำกำไรดีที่สุดหายไปเกือบหนึ่งในสิบ และรายได้แทบไม่โตเลยที่ 0.4 เปอร์เซ็นต์ พูดอีกอย่างคือกำไรที่กลับมาไม่ได้มาจากการเติบโต แต่มาจากการขึ้นราคาและตัดลูกค้าที่ขาดทุนทิ้ง ซึ่งเป็นวิธีที่ใช้ได้ครั้งเดียว นอกจากนี้สัดส่วนค่ารักษาที่ดีขึ้นยังมีการปรับสำรองงวดก่อน 860 ล้านช่วยอยู่ และค่าใช้จ่ายดำเนินงานต่อรายได้กลับแย่ลงเล็กน้อย เราประเมินมูลค่าด้วยแบบจำลองฝั่งทุนเพราะเป็นธุรกิจประกัน ที่ซึ่งเงินสำรองค่ารักษาและเงินลงทุนที่หนุนสำรองไม่ใช่หนี้ในความหมายปกติ ผลคือมูลค่าถ่วงน้ำหนักสามฉากทัศน์ที่ 420.12 ดอลลาร์ เทียบราคาตลาด 420.57 ดอลลาร์ คิดเป็นอัตราส่วน 1.00 พอดี ซึ่งเป็นค่าที่ใกล้เหมาะสมที่สุดเท่าที่กรอบนี้เคยคำนวณได้ เมื่อคำนวณย้อนกลับ ราคานี้ฝังสมมติฐานว่าอัตรากำไรสุทธิจะอยู่ที่ 4.97 เปอร์เซ็นต์ตลอดสิบปี ซึ่งเท่ากับที่ไตรมาสล่าสุดทำได้พอดี เราแทบไม่ต่างจากตลาดในข้อนี้ และต้องประกาศตรง ๆ ว่ารายงานนี้ไม่มีมุมมองที่ต่างจากตลาดอย่างมีนัย มีแต่กรอบเรื่องราคาและจังหวะ ข้อสรุปจึงเป็นถือ ไม่ใช่ซื้อเพิ่มและไม่ใช่ขาย เพราะผลตอบแทนคาดหวังในห้าปีอยู่ระหว่างศูนย์ถึงบวกห้าเปอร์เซ็นต์ต่อปี ซึ่งยังต่ำกว่าต้นทุนของทุน จุดที่กรอบนี้จะเปลี่ยนเป็นน่าสนใจคือราว 336 ดอลลาร์ หรือเมื่อจำนวนสมาชิกหยุดหด ซึ่งจะดันคะแนนคุณภาพขึ้นชั้นสูงและเปลี่ยนช่องในตารางตัดสินใจได้จริง งบไตรมาสวันที่ 14 ตุลาคมจะบอกทั้งสองเรื่องพร้อมกัน",
      en: "UnitedHealth has come through the worst year in its history. Operating profit fell from about 8% of revenue to 0.3% in the final quarter of 2025, because it had priced premiums below the medical costs that actually arrived. It then repaired itself in two quarters: operating margin returned to 8.0% in the first quarter of 2026 and 7.1% in the second, or $8.0 billion, up 55% year on year. The medical care ratio fell from 89.4% to 86.7%, and the company raised full-year guidance on every line — earnings per share from above $17.10 to $18.45–18.95, cash flow from $18 billion to about $24 billion, and buybacks from $2.5 billion to at least $5 billion. Return on equity is 16% against an 8.4% cost of equity. We score quality 68 out of 100, two points below the high tier. What holds it down is demand, because the company is getting smaller: membership fell from 50.1 million to 48.5 million in a year, the profitable Medicare Advantage book lost almost a tenth of its members, and revenue grew just 0.4%. In other words the profit recovery did not come from growth; it came from raising prices and shedding loss-making customers, which works once. The improved medical ratio also included $860 million of prior-period reserve releases, and the operating cost ratio actually worsened slightly. We valued the company on an equity-side model, because for an insurer the medical reserves and the investments backing them are not debt in the ordinary sense. The probability-weighted result is $420.12 against a market price of $420.57, a ratio of 1.00 — the closest to fair this framework has produced. Reversing the arithmetic, the price embeds a 4.97% net margin for a decade, exactly what last quarter delivered. We are barely different from the market on that, and we say plainly that this report carries no meaningful variant view, only a framework on price and timing. The conclusion is hold — neither add nor sell — because the five-year expected return runs from zero to about 5% a year, still below the cost of capital. The framework turns interesting near $336, or when membership stops shrinking, which would lift the quality score into the high tier and genuinely change the cell in the decision table. The 14 October quarter will speak to both at once.",
    },

    sources: [
      { label: "UNH 8-K Exhibit 99.1 — ผลประกอบการไตรมาส 2 ปี 2026 (16 ก.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/731766/000073176626000191/earningsrelease2q26_7152.htm" },
      { label: "SEC EDGAR XBRL Company Facts (CIK 0000731766)", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000731766.json" },
      { label: "Damodaran — Betas by Sector (Healthcare Support Services, unlevered 0.74)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
      { label: "Moody's ปรับมุมมองเป็นลบ ยืนยันอันดับ A2 พร้อมเงื่อนไขกลับสู่มีเสถียรภาพ", url: "https://www.investing.com/news/stock-market-news/moodys-changes-unitedhealths-outlook-to-negative-affirms-a2-rating-93CH-4089352" },
    ],
    pdfUrl: "/reports/unh-deep-o-v42.pdf",
  },
  {
    ticker: "NVDA",
    company: "NVIDIA Corporation",
    exchange: "NASDAQ",
    asOf: "2026-07-30",
    refPrice: 190.01,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ ห้ามเพิ่ม", en: "Hold / No Add" },
    quality: 91,
    confidence: 3,
    uncertainty: "MED",

    oneQuestion: {
      th: "การเติบโตระดับ 85 เปอร์เซ็นต์ต่อปีจะยืนนานพอที่จะพารายได้ไปถึงราว 1.2 ล้านล้านดอลลาร์หรือไม่ ซึ่งเป็นระดับที่ราคา 190 ดอลลาร์ต้องการ วัดด้วยรายได้จากศูนย์ข้อมูลรายไตรมาส ซึ่งไตรมาสล่าสุดอยู่ที่ 75.2 พันล้าน เพิ่มขึ้น 92 เปอร์เซ็นต์",
      en: "Will growth of roughly 85% a year last long enough to carry revenue to about $1.2 trillion, which is what a $190 price requires? Measured by quarterly data centre revenue, which was $75.2B last quarter, up 92%.",
    },
    thesisOneSentence: {
      th: "NVIDIA เป็นธุรกิจที่ทำกำไรต่อทุนได้สูงที่สุดเท่าที่กรอบนี้เคยวัด และโตเร็วที่สุดในบรรดาบริษัทขนาดล้านล้าน แต่ที่ 190 ดอลลาร์ ราคาได้จ่ายค่าฉากที่ดีที่สุดไปแล้ว ไม่เหลือส่วนเผื่อให้ผิดพลาด",
      en: "NVIDIA earns the highest return on capital this framework has ever measured and grows faster than any company of its size — but at $190 the price has already paid for the best case, leaving no margin for error.",
    },

    business: {
      whatItDoes: {
        th: "NVIDIA ออกแบบชิปประมวลผลกราฟิกและระบบที่ใช้ฝึกและรันปัญญาประดิษฐ์ พร้อมซอฟต์แวร์และอุปกรณ์เชื่อมต่อความเร็วสูงที่ทำให้ชิปหลายหมื่นตัวทำงานเป็นเครื่องเดียวกัน ลูกค้าหลักคือผู้ให้บริการคลาวด์และบริษัทเทคโนโลยีขนาดใหญ่ที่สร้างศูนย์ข้อมูล AI",
        en: "NVIDIA designs the graphics processors and systems used to train and run artificial intelligence, along with the software and high-speed networking that lets tens of thousands of chips act as one machine. Its main customers are cloud providers and large technology companies building AI data centres.",
      },
      revenueMix: [
        { label: { th: "ชิปประมวลผลสำหรับศูนย์ข้อมูล", en: "Data centre compute chips" }, sharePct: 74 },
        { label: { th: "อุปกรณ์เชื่อมต่อเครือข่ายในศูนย์ข้อมูล", en: "Data centre networking" }, sharePct: 18 },
        { label: { th: "อุปกรณ์ปลายทาง พีซี เกม รถยนต์ หุ่นยนต์", en: "Edge devices: PCs, gaming, automotive, robotics" }, sharePct: 8 },
      ],
      moat: {
        th: "นักพัฒนา AI ทั่วโลกเขียนโปรแกรมบนแพลตฟอร์มซอฟต์แวร์ CUDA ของ NVIDIA มากว่าสิบห้าปี การย้ายไปใช้ชิปยี่ห้ออื่นแปลว่าต้องเขียนและทดสอบใหม่ทั้งหมด นอกจากนี้บริษัทขายทั้งชิป เครือข่าย และซอฟต์แวร์เป็นระบบเดียว ทำให้เทียบเฉพาะราคาชิปไม่ได้",
        en: "AI developers worldwide have written code on NVIDIA's CUDA software platform for over fifteen years, so moving to another chip means rewriting and retesting everything. The company also sells chips, networking and software as one system, which makes comparing chip prices alone impossible.",
      },
      moatStrength: "wide",
      strengths: [
        {
          th: "รายได้ไตรมาสล่าสุดโต 85% และกำไรขั้นต้นอยู่ที่ 74.9%",
          en: "Revenue grew 85% last quarter with a 74.9% gross margin.",
        },
        {
          th: "ผลตอบแทนต่อเงินลงทุนราว 168% สูงกว่าต้นทุนเงินทุนราวสิบห้าเท่า",
          en: "Return on invested capital near 168%, about fifteen times its cost of capital.",
        },
        {
          th: "อันดับเครดิต AA จาก S&P และ Aa1 จาก Moody's ต่ำกว่าระดับสูงสุดขั้นเดียว",
          en: "Rated AA by S&P and Aa1 by Moody's, one notch below the top.",
        },
      ],
      weaknesses: [
        {
          th: "ลูกค้ารายใหญ่ไม่กี่รายเป็นสัดส่วนรายได้ก้อนใหญ่ และกำลังสร้างชิปเองแข่ง",
          en: "A few large customers are a big share of revenue, and are building rival chips.",
        },
        {
          th: "กำไรตามบัญชีไตรมาสล่าสุดรวมกำไรจากการตีมูลค่าหุ้นที่ถือ 15.9 พันล้าน",
          en: "Last quarter's reported profit included $15.9B of gains on shares it holds.",
        },
        {
          th: "ถือหุ้นบริษัทอื่น 73.6 พันล้าน โดย 27.4 พันล้านติดข้อจำกัดห้ามขาย",
          en: "Holds $73.6B of other companies' shares, $27.4B of it under selling restrictions.",
        },
      ],
      competitors: ["AMD", "Broadcom", "Google", "Amazon", "Intel"],
    },
    businessRisks: [
      {
        risk: { th: "ลูกค้ารายใหญ่กำลังสร้างชิปของตัวเองมาแข่ง", en: "The largest customers are building rival chips" },
        why: {
          th: "ผู้ให้บริการคลาวด์ไม่กี่รายที่เป็นสัดส่วนรายได้ก้อนใหญ่ที่สุด กำลังพัฒนาชิปปัญญาประดิษฐ์ของตัวเองเพื่อลดการพึ่งพา ซึ่งแปลว่าลูกค้ารายเดียวกันเป็นทั้งแหล่งรายได้และคู่แข่งในอนาคต",
          en: "The handful of cloud providers that make up the largest share of revenue are developing their own AI chips to reduce dependence, so the same customers are both the revenue base and future competitors.",
        },
        kind: "competition",
      },
      {
        risk: {
          th: "การเติบโตระดับนี้ไม่มีบริษัทใดรักษาไว้ได้นาน",
          en: "No company sustains growth at this rate for long",
        },
        why: {
          th: "รายได้โต 85 เปอร์เซ็นต์ในหนึ่งปี ซึ่งเป็นระดับที่ราคาปัจจุบันต้องการให้ดำเนินต่อไปอีกหลายปี การชะลอลงเป็นเรื่องปกติของธุรกิจที่เติบโตเร็ว และธุรกิจชิปมีวัฏจักรขึ้นลงชัดเจน",
          en: "Revenue grew 85% in a year, a rate today's price needs to continue for years. Slowing is normal for fast-growing businesses, and the chip industry has clear boom-and-bust cycles.",
        },
        kind: "cyclical",
      },
      {
        risk: {
          th: "กำไรตามบัญชีรวมกำไรจากการตีมูลค่าหุ้นที่ถือ",
          en: "Reported profit includes gains from revaluing shares it holds",
        },
        why: {
          th: "ไตรมาสล่าสุดมีกำไรส่วนนี้ 15.9 พันล้านดอลลาร์ก่อนภาษี ทำให้กำไรตามบัญชีที่ 58.3 พันล้าน สูงกว่าตัวเลขที่บริษัทเองเรียกว่าไม่รวมรายการพิเศษ ซึ่งอยู่ที่ 45.5 พันล้าน",
          en: "Last quarter that added $15.9B before tax, so reported profit of $58.3B sits above the $45.5B the company itself reports excluding such items.",
        },
        kind: "financial",
      },
      {
        risk: {
          th: "บริษัทลงทุนในลูกค้าของตัวเองเป็นเงินก้อนใหญ่",
          en: "The company invests heavily in its own customers",
        },
        why: {
          th: "ไตรมาสเดียวซื้อหุ้นบริษัทที่ไม่ได้จดทะเบียนเพิ่ม 18.6 พันล้านดอลลาร์ จากไตรมาสเดียวกันปีก่อนที่ 0.6 พันล้าน รวมพอร์ตหุ้นทั้งหมด 73.6 พันล้าน บริษัทเหล่านั้นส่วนใหญ่ซื้อชิปของ NVIDIA เอง ถ้าความต้องการชะลอ ทั้งยอดขายและมูลค่าพอร์ตจะลดลงพร้อมกัน",
          en: "In one quarter it bought $18.6B of shares in private companies, against $0.6B in the same quarter last year, taking the total equity portfolio to $73.6B. Most of those companies buy NVIDIA chips, so if demand slows, sales and portfolio value fall together.",
        },
        kind: "financial",
      },
      {
        risk: {
          th: "นโยบายควบคุมการส่งออกทำให้ตลาดจีนหายจากประมาณการ",
          en: "Export controls have removed China from the forecast",
        },
        why: {
          th: "บริษัทระบุเองว่าไม่ได้นับรายได้ชิปศูนย์ข้อมูลจากจีนไว้ในคาดการณ์ไตรมาสหน้าเลย ซึ่งแปลว่าตลาดที่เคยสำคัญถูกตัดออกจากแผนด้วยเหตุผลเชิงนโยบาย",
          en: "The company states it assumes no data centre compute revenue from China in next quarter's outlook, meaning a market that once mattered has been removed from the plan for policy reasons.",
        },
        kind: "regulation",
      },
    ],

    valuation: {
      bear: 54.52,
      base: 120.44,
      bull: 196.66,
      ev: 126.83,
      bearP: 0.25,
      baseP: 0.45,
      bullP: 0.3,
      trigger: 101.46,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "เมื่อคำนวณย้อนกลับจากราคา 190.01 ดอลลาร์ ตลาดฝังสมมติฐานว่ารายได้จะโต 21.3 เปอร์เซ็นต์ต่อปีต่อเนื่องสิบปี จนแตะ 1.74 ล้านล้านดอลลาร์ในปี 2036 อีกทางหนึ่งคือฉากที่ดีที่สุดที่เราเถียงได้ให้มูลค่า 196.66 ดอลลาร์ ซึ่งใกล้ราคาตลาดเพียง 3.5 เปอร์เซ็นต์ พูดง่าย ๆ คือตลาดกำลังตีราคาที่ฉาก Bull",
        en: "Reversed out of the $190.01 price, the market embeds 21.3% annual revenue growth for a decade, reaching $1.74 trillion by 2036. Put another way, the best case we can argue is worth $196.66, only 3.5% above the market price. The market is pricing the bull case.",
      },
      us: {
        th: "เราไม่ได้เถียงว่าการเติบโตไม่จริง มันจริงและกำลังเร่งขึ้นด้วย สิ่งที่เราต่างคือระยะเวลา เรามองว่าการเติบโตสูงจะยืนราวสี่ถึงห้าปีแล้วชะลอเร็ว และอัตรากำไรจากการดำเนินงานปลายทางจะลงมาที่ 52 เปอร์เซ็นต์เมื่อชิปที่ลูกค้าออกแบบเองเข้ามา ตัวแปรเรื่องระยะเวลาเป็นสิ่งที่ประเมินยากที่สุดและไม่มีหลักฐานภายนอกมาปิดคำถามได้ ซึ่งเป็นเหตุผลที่เรากดระดับความเชื่อมั่นลง",
        en: "We do not argue the growth is unreal — it is real and accelerating. We differ on duration: we model high growth lasting four to five years then fading fast, with the long-run operating margin settling at 52% as customer-designed chips arrive. Duration is the hardest variable to judge and no external evidence can settle it, which is why we lower our confidence rather than pick a side.",
      },
    },

    killers: [
      {
        th: "รายได้ไตรมาสหน้าเกิน 95 พันล้านดอลลาร์ เทียบเป้าที่ 91 พันล้าน",
        en: "Next quarter's revenue exceeds $95B against the $91B guide",
      },
      {
        th: "รายได้ศูนย์ข้อมูลโตเกิน 60 เปอร์เซ็นต์ต่อปี สองไตรมาสติด",
        en: "Data centre revenue grows above 60% year over year for two consecutive quarters",
      },
      {
        th: "กำไรขั้นต้นยืนเหนือ 73 เปอร์เซ็นต์ ผ่านการแข่งขันรอบใหม่",
        en: "Gross margin holds above 73% through the next round of competition",
      },
      {
        th: "ยอดซื้อหุ้นบริษัทเอกชนชะลอลงต่ำกว่า 5 พันล้านต่อไตรมาส",
        en: "Purchases of private company shares slow below $5B a quarter",
      },
      {
        th: "ราคาลงแตะราว 101 ดอลลาร์ ซึ่งเป็นจุดที่ช่องว่างต่อมูลค่าปิดจนน่าสนใจ",
        en: "The price reaches about $101, where the gap to value closes to an interesting level",
      },
    ],
    catalysts: [
      { when: { th: "~ปลาย ส.ค. 2026", en: "~Late Aug 2026" }, what: {
        th: "งบไตรมาส 2 ปีงบ 2027 ตัดสินทั้งการเติบโต อัตรากำไร และยอดซื้อหุ้นเอกชนพร้อมกัน",
        en: "Q2 FY2027 results settle growth, margin and the pace of private investments at once",
      } },
      { when: { th: "~พ.ย. 2026", en: "~Nov 2026" }, what: {
        th: "งบไตรมาส 3 เป็นไตรมาสที่สองติดที่จะบอกว่าการเติบโตยืนหรือชะลอ",
        en: "Q3 results are the second consecutive read on whether growth holds or fades",
      } },
      { when: { th: "~ก.พ. 2027", en: "~Feb 2027" }, what: {
        th: "รายงานประจำปี ซึ่งเปิดเผยสัดส่วนรายได้จากลูกค้ารายใหญ่ที่สุดปีละครั้ง",
        en: "The annual report, which discloses the largest customer's revenue share once a year",
      } },
      { when: { th: "ต่อเนื่อง", en: "Ongoing" }, what: {
        th: "นโยบายควบคุมการส่งออกไปจีน และการเปิดตัวชิปที่ลูกค้าออกแบบเอง",
        en: "Export control policy toward China, and launches of customer-designed chips",
      } },
    ],
    returnMath: {
      floorPct: "−7.8%",
      onTrackPct: "+1.0%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่งแล้วราคาไล่ลงมาหา ส่วน on-track คือมูลค่าโตปีละ 9.5 เปอร์เซ็นต์ระหว่างที่ราคาปิดช่องว่าง ทั้งช่วงอยู่ใต้ต้นทุนส่วนของผู้ถือหุ้นที่ 11.3 เปอร์เซ็นต์ ข้อควรระวังเฉพาะกรณีนี้คือการกระจายผลลัพธ์ของ NVIDIA เอียงไปทางบวกมาก ถ้าการเติบโตยืนได้จริงอีกห้าปี ฉากที่ดีที่สุดของเราที่ 196.66 ดอลลาร์ก็ยังต่ำกว่าสิ่งที่จะเกิดขึ้นจริง ตัวเลขติดลบข้างต้นจึงต้องอ่านคู่กับข้อเท็จจริงว่าเราไม่มีเครื่องมือปิดคำถามเรื่องระยะเวลาได้ นี่ไม่ใช่ราคาเป้าหมาย",
        en: "These assume the price reverts to the estimate within five years — floor is value standing still while price falls to meet it, on-track is value compounding 9.5% a year as the gap closes. The whole range sits below the 11.3% cost of equity. One caveat is specific to this name: the distribution of outcomes is heavily right-skewed. If growth really does hold for another five years, even our best case of $196.66 would prove too low. The negative figures above must be read alongside the fact that we have no tool capable of settling the duration question. This is not a price target.",
      },
    },

    sensitivity: {
      rowLabel: { th: "ตัวคูณเส้นทางการเติบโตเทียบฐาน", en: "Growth path as a multiple of the base case" },
      colLabel: { th: "อัตรากำไรจากการดำเนินงานปลายทาง", en: "Long-run operating margin" },
      rows: ["0.6x", "0.8x", "1.0x (Base)", "1.3x", "1.6x"],
      cols: ["45%", "52% (Base)", "58%", "65%"],
      grid: [
        [80, 87, 93, 101],
        [94, 103, 111, 120],
        [112, 123, 132, 143],
        [142, 157, 170, 185],
        [180, 200, 216, 236],
      ],
      baseRow: 2,
      baseCol: 1,
      caption: {
        th: "สองแกนนี้คือสิ่งที่ตัดสินหุ้นตัวนี้จริง คือระยะเวลาที่การเติบโตสูงจะยืนอยู่ และอัตรากำไรปลายทางเมื่อการแข่งขันเข้ามา ทั้งตารางให้มูลค่าระหว่าง 80 ถึง 236 ดอลลาร์ และมีเพียงแถวล่างสุดที่สมมติการเติบโต 1.6 เท่าของฐานเท่านั้นที่เกินราคาตลาด 190 ดอลลาร์ แม้แถว 1.3 เท่าที่อัตรากำไร 65 เปอร์เซ็นต์ก็ยังได้เพียง 185 กรอบเข้ม = Base",
        en: "These two axes are what actually decide this stock: how long high growth lasts, and the margin that survives competition. The table spans $80 to $236, and only the bottom row — growth at 1.6 times the base path — clears the $190 market price. Even 1.3 times at a 65% margin reaches just $185. Bold box = Base.",
      },
    },

    onePager: {
      th: "NVIDIA รายงานรายได้ไตรมาสล่าสุดที่ 81.6 พันล้านดอลลาร์ เพิ่มขึ้น 85 เปอร์เซ็นต์จากปีก่อนและ 20 เปอร์เซ็นต์จากไตรมาสก่อน โดยรายได้จากศูนย์ข้อมูลอยู่ที่ 75.2 พันล้าน เพิ่มขึ้น 92 เปอร์เซ็นต์ และส่วนอุปกรณ์เชื่อมต่อเครือข่ายเพิ่มขึ้นถึง 199 เปอร์เซ็นต์ กำไรขั้นต้นอยู่ที่ 74.9 เปอร์เซ็นต์ และกำไรจากการดำเนินงาน 53.5 พันล้าน หรือ 65.6 เปอร์เซ็นต์ของรายได้ ที่สำคัญกว่าตัวเลขเหล่านั้นคือผลตอบแทนต่อเงินลงทุนซึ่งอยู่ราว 168 เปอร์เซ็นต์ เทียบต้นทุนเงินทุน 11.3 เปอร์เซ็นต์ เป็นส่วนต่างที่กว้างที่สุดที่กรอบนี้เคยคำนวณได้ กระแสเงินสดอิสระไตรมาสเดียวอยู่ที่ 48.6 พันล้าน บริษัทคืนเงินผู้ถือหุ้นราวสองหมื่นล้านในไตรมาส อนุมัติซื้อหุ้นคืนเพิ่มอีกแปดหมื่นล้าน และขึ้นเงินปันผลจากหนึ่งเซ็นต์เป็นยี่สิบห้าเซ็นต์ต่อหุ้น สองสำนักจัดอันดับเพิ่งอัปเกรดเครดิตเป็น AA และ Aa1 เราให้คะแนนคุณภาพ 91 เต็ม 100 เท่ากับ Eli Lilly และ ASML ปัญหาไม่ได้อยู่ที่ธุรกิจ แต่อยู่ที่ราคา ที่ 190 ดอลลาร์ต่อหุ้น มูลค่าตลาดอยู่ที่ 4.6 ล้านล้านดอลลาร์ เราประเมินสามฉากทัศน์ได้ 54.52 ดอลลาร์ในฉากแย่ 120.44 ในฉากกลาง และ 196.66 ในฉากดี ถ่วงน้ำหนักแล้วได้ 126.83 ดอลลาร์ คิดเป็นสัดส่วน 0.67 ของราคา สิ่งที่ควรสังเกตคือฉากที่ดีที่สุดของเราอยู่ที่ 196.66 ซึ่งใกล้ราคาตลาดเพียง 3.5 เปอร์เซ็นต์ พูดง่าย ๆ คือราคาปัจจุบันได้จ่ายค่าฉากที่ดีที่สุดไปแล้ว โดยฉากนั้นสมมติว่ารายได้จะโตไปถึง 1.2 ล้านล้านดอลลาร์ในสิบปี เมื่อคำนวณย้อนกลับ ราคานี้ฝังการเติบโต 21.3 เปอร์เซ็นต์ต่อปีต่อเนื่องสิบปี จนรายได้แตะ 1.74 ล้านล้าน ซึ่งราวสองเท่าของอุตสาหกรรมเซมิคอนดักเตอร์ทั้งโลกในวันนี้ แต่เราปิดคำถามนี้ไม่ได้ เพราะ NVIDIA ไม่ให้เป้าหมายระยะยาว และตลาดโครงสร้างพื้นฐานปัญญาประดิษฐ์ยังไม่มีขนาดที่ตกลงกันได้ นี่คือเหตุผลที่เรากดระดับความเชื่อมั่นเหลือ 3 จาก 5 ทั้งที่ข้อมูลงบครบและสด อีกเรื่องที่ต้องบอกคือกำไรที่รายงาน 58.3 พันล้านนั้น สูงกว่าตัวเลขที่บริษัทเองเรียกว่าไม่รวมรายการพิเศษซึ่งอยู่ที่ 45.5 พันล้าน ส่วนต่างคือกำไรจากการตีมูลค่าหุ้นบริษัทอื่นที่ NVIDIA ถืออยู่ 15.9 พันล้านก่อนภาษี และในไตรมาสเดียวบริษัทซื้อหุ้นบริษัทที่ไม่ได้จดทะเบียนเพิ่มอีก 18.6 พันล้าน จากไตรมาสเดียวกันปีก่อนที่เพียง 0.6 พันล้าน ทำให้พอร์ตหุ้นรวมอยู่ที่ 73.6 พันล้าน โดย 27.4 พันล้านติดข้อจำกัดห้ามขาย บริษัทเหล่านั้นส่วนใหญ่คือลูกค้าที่ซื้อชิปของ NVIDIA เอง ซึ่งแปลว่าถ้าความต้องการชิปชะลอลง ทั้งยอดขายและมูลค่าพอร์ตจะลดลงพร้อมกัน เราจึงหักส่วนลดพอร์ตนี้ก่อนนำมารวมในมูลค่า ข้อสรุปคือถือ ไม่ใช่ซื้อเพิ่ม และไม่ใช่ขาย เพราะธุรกิจนี้ดีที่สุดเท่าที่เราเคยวัด แต่ราคาไม่เหลือส่วนเผื่อให้ผิดพลาดเลย จุดที่กรอบนี้จะเปลี่ยนเป็นน่าสนใจคือราว 101 ดอลลาร์ ซึ่งต่ำกว่าจุดต่ำสุดในรอบปี หรือเมื่องบไตรมาสหน้าปลายเดือนสิงหาคมพิสูจน์ว่าการเติบโตยังเร่งอยู่จริง",
      en: "NVIDIA reported quarterly revenue of $81.6 billion, up 85% from a year ago and 20% from the previous quarter, with data centre revenue of $75.2 billion, up 92%, and networking within it up 199%. Gross margin was 74.9% and operating profit $53.5 billion, or 65.6% of revenue. More telling than any of those is return on invested capital of roughly 168% against an 11.3% cost of capital — the widest spread this framework has ever computed. Free cash flow was $48.6 billion in a single quarter. The company returned about $20 billion to shareholders in the quarter, approved a further $80 billion of buybacks, and raised the dividend from one cent to twenty-five cents a share. Both rating agencies recently upgraded it, to AA and Aa1. We score quality 91 out of 100, level with Eli Lilly and ASML. The problem is not the business; it is the price. At $190 a share the market value is $4.6 trillion. Our three scenarios give $54.52 in the bear case, $120.44 in the base and $196.66 in the bull, weighting to $126.83, or 0.67 of the price. Note that our best case of $196.66 sits just 3.5% above the market price: today's price has already paid for the best outcome we can argue, and that outcome assumes revenue reaching $1.2 trillion within a decade. Reversing the arithmetic, the price embeds 21.3% annual growth for ten years, reaching $1.74 trillion, roughly twice today's entire world semiconductor industry. We cannot settle that question, because NVIDIA publishes no long-term target and the AI infrastructure market has no agreed size — which is why we cap our confidence at 3 out of 5 even though the financial data is complete and fresh. One more thing must be said: the reported profit of $58.3 billion is higher than the $45.5 billion the company itself reports excluding special items. The difference is $15.9 billion of pre-tax gains on shares NVIDIA holds in other companies. In that same quarter it bought a further $18.6 billion of shares in private companies, against just $0.6 billion in the year-ago quarter, taking the portfolio to $73.6 billion, of which $27.4 billion cannot currently be sold. Most of those companies are customers who buy NVIDIA chips, so if chip demand slows, sales and portfolio value fall together — which is why we discount the portfolio before including it. The conclusion is hold rather than add, and not sell, because this is the finest business we have measured but the price leaves no room for error. The framework turns interesting near $101, below the one-year low, or when next quarter's results in late August prove growth is still accelerating.",
    },

    sources: [
      { label: "NVIDIA Form 10-Q ไตรมาส 1 ปีงบ 2027 (ยื่น 20 พ.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000052/nvda-20260426.htm" },
      { label: "8-K Exhibit 99.1 — ผลประกอบการ Q1 FY2027 (20 พ.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000051/q1fy27pr.htm" },
      { label: "SEC EDGAR XBRL Company Facts (CIK 0001045810)", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0001045810.json" },
      { label: "Damodaran — Betas by Sector (Semiconductor, unlevered 1.50)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
      { label: "S&P อัปอันดับ NVIDIA เป็น AA (11 มิ.ย. 2026)", url: "https://www.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3579354" },
    ],
    pdfUrl: "/reports/nvda-deep-o-v42.pdf",
  },
  {
    ticker: "WMT",
    company: "Walmart Inc.",
    exchange: "NYSE",
    asOf: "2026-07-30",
    refPrice: 111.02,

    verdict: "hold",
    verdictEmoji: "🟡",
    verdictLabel: { th: "ถือ ห้ามเพิ่ม", en: "Hold / No Add" },
    quality: 74,
    confidence: 4,
    uncertainty: "MED",

    oneQuestion: {
      th: "บริษัทใช้เงินลงทุน 3.5 เปอร์เซ็นต์ของยอดขายต่อเนื่องโดยไม่บอกว่าจะจบเมื่อไหร่ และเงินสดที่เหลือหลังลงทุนลดลง 42 เปอร์เซ็นต์ในห้าปี ธุรกิจกำไรสูงที่โตเร็วอย่างโฆษณาและค่าสมาชิก จะดันกำไรต่อยอดขายจาก 4.15 เปอร์เซ็นต์ขึ้นไปได้ถึงระดับไหน และทันหรือไม่",
      en: "The company spends 3.5% of sales on new investment with no stated end date, and cash left after that investment has fallen 42% in five years. How far can the fast-growing high-margin businesses — advertising and membership — push operating profit above 4.15% of sales, and will it arrive in time?",
    },
    thesisOneSentence: {
      th: "Walmart ชนะสงครามค้าปลีกจริงและกำลังสร้างเครื่องยนต์กำไรสูงจริง แต่ที่ 40 เท่าของกำไร ราคาได้จ่ายค่าความสำเร็จของแผนนั้นล่วงหน้าไปหมดแล้ว ก่อนที่งบจะแสดงให้เห็นแม้แต่เศษเสี้ยวเดียวของมัน",
      en: "Walmart is genuinely winning the retail war and genuinely building a high-margin engine — but at 40 times earnings the price has already paid for that plan's success, before the accounts show even a fraction of it.",
    },

    business: {
      whatItDoes: {
        th: "Walmart ขายของชำ ของใช้ในบ้าน เสื้อผ้า และสินค้าทั่วไป ผ่านร้านกว่า 10,900 สาขาใน 19 ประเทศและผ่านเว็บกับแอป ลูกค้าคือครัวเรือนทั่วไปที่ซื้อของกินของใช้ประจำสัปดาห์ และในช่วงหลังบริษัทยังเก็บเงินจากผู้ผลิตสินค้าที่จ่ายค่าโฆษณาบนแพลตฟอร์มของตัวเอง กับผู้ขายรายย่อยที่ฝากขายและใช้ระบบคลังของ Walmart",
        en: "Walmart sells groceries, household goods, clothing and general merchandise through more than 10,900 stores in 19 countries and through its website and app. Its customers are ordinary households doing their weekly shop. More recently it also collects money from brands that pay to advertise on its own platform, and from small sellers who list products and use Walmart's warehouses.",
      },
      revenueMix: [
        { label: { th: "Walmart สหรัฐ", en: "Walmart U.S." }, sharePct: 67 },
        { label: { th: "Walmart ต่างประเทศ", en: "Walmart International" }, sharePct: 20 },
        { label: { th: "Sam's Club สหรัฐ", en: "Sam's Club U.S." }, sharePct: 13 },
      ],
      moat: {
        th: "Walmart ซื้อของถูกกว่าคู่แข่งเพราะซื้อเยอะกว่าทุกราย แล้วส่งต่อส่วนต่างเป็นราคาที่ถูกกว่า ซึ่งดึงคนเข้ามาซื้อมากขึ้นและทำให้ซื้อได้ถูกลงอีก ร้านกว่า 4,600 สาขาในสหรัฐยังอยู่ห่างจากคนอเมริกัน 90 เปอร์เซ็นต์ไม่เกินสิบไมล์ ทำให้ร้านกลายเป็นคลังสินค้าสำหรับส่งของด่วนที่คู่แข่งออนไลน์ต้องสร้างใหม่ทั้งหมด",
        en: "Walmart buys cheaper than anyone because it buys more than anyone, then passes the difference on as lower prices, which brings in more shoppers and lets it buy cheaper still. Its 4,600-plus U.S. stores also sit within ten miles of 90% of Americans, turning the store base into a delivery network that online rivals would have to build from scratch.",
      },
      moatStrength: "wide",
      strengths: [
        {
          th: "ยอดขายสาขาเดิมสหรัฐโต 4.1% โดยจำนวนครั้งที่คนเข้าร้านโต 3.0%",
          en: "U.S. same-store sales up 4.1%, with store visits up 3.0%.",
        },
        {
          th: "ธุรกิจโฆษณาโต 37% และค่าสมาชิกโต 17.4% ในไตรมาสล่าสุด",
          en: "Advertising grew 37% and membership fees 17.4% last quarter.",
        },
        {
          th: "อันดับเครดิต AA ทั้งสามสำนัก กู้สิบปีได้ที่ดอกเบี้ย 4.76%",
          en: "Rated AA by all three agencies; borrows for ten years at 4.76%.",
        },
      ],
      weaknesses: [
        {
          th: "เงินสดหลังลงทุนลดลง 42% ในห้าปี จากการลงทุนที่เพิ่มขึ้น 160%",
          en: "Cash after investment fell 42% in five years as investment rose 160%.",
        },
        {
          th: "กำไรจากการดำเนินงานคิดเป็น 4.15% ของยอดขาย และห้าปีไม่ขยับ",
          en: "Operating profit is 4.15% of sales and has not moved in five years.",
        },
        {
          th: "ไตรมาสล่าสุดค่าใช้จ่ายโต 8.9% เร็วกว่ายอดขายที่โต 7.1%",
          en: "Last quarter costs grew 8.9%, faster than the 7.1% sales growth.",
        },
      ],
      competitors: ["Amazon", "Costco", "Target", "Kroger", "Dollar General"],
    },
    businessRisks: [
      {
        risk: {
          th: "เงินลงทุนกินกระแสเงินสดมากขึ้นทุกปีโดยไม่มีกำหนดจบ",
          en: "Investment eats more cash every year with no end date",
        },
        why: {
          th: "เงินลงทุนเพิ่มจาก 10.3 พันล้านดอลลาร์เป็น 26.6 พันล้านในห้าปี ทำให้เงินสดที่เหลือหลังลงทุนลดลงจาก 25.8 พันล้านเหลือ 14.9 พันล้าน ทั้งที่ยอดขายเพิ่มขึ้น 27 เปอร์เซ็นต์ในช่วงเดียวกัน",
          en: "Capital spending rose from $10.3B to $26.6B in five years, cutting cash left after investment from $25.8B to $14.9B — even though sales grew 27% over the same period.",
        },
        kind: "execution",
      },
      {
        risk: {
          th: "กำไรต่อยอดขายบางมากและไม่ขยับมาห้าปี",
          en: "Profit per dollar of sales is thin and has not moved in five years",
        },
        why: {
          th: "บริษัทเก็บกำไรจากการดำเนินงานได้ 4.15 ดอลลาร์จากทุก 100 ดอลลาร์ที่ขาย ตัวเลขนี้อยู่ในกรอบเดิมมาห้าปี แม้ธุรกิจโฆษณาจะโตเลขสองหลักสูงตลอดช่วงนั้น",
          en: "The company keeps $4.15 of operating profit from every $100 of sales. That figure has stayed in the same range for five years, even as advertising grew at high double digits throughout.",
        },
        kind: "financial",
      },
      {
        risk: {
          th: "Amazon มีพื้นที่ลดราคามากกว่าในสงครามของชำ",
          en: "Amazon has more room to cut prices in the grocery fight",
        },
        why: {
          th: "Amazon เก็บกำไรจากการดำเนินงานได้ 10.77 ดอลลาร์ต่อ 100 ดอลลาร์ ซึ่งมากกว่าสองเท่าครึ่ง จึงยอมขาดทุนในของชำได้นานกว่าถ้าเลือกจะสู้",
          en: "Amazon keeps $10.77 per $100 of sales, more than two and a half times as much, so it can absorb losses in groceries for longer if it chooses to fight.",
        },
        kind: "competition",
      },
      {
        risk: {
          th: "หนึ่งในห้าของยอดขายอยู่นอกสหรัฐและขึ้นกับค่าเงิน",
          en: "A fifth of sales sits outside the U.S. and depends on exchange rates",
        },
        why: {
          th: "ไตรมาสล่าสุดยอดขายต่างประเทศเพิ่มขึ้น 18.0 เปอร์เซ็นต์ตามที่รายงาน แต่เมื่อตัดผลค่าเงินออกเหลือ 10.1 เปอร์เซ็นต์ ส่วนต่างนั้นหายไปได้ถ้าค่าเงินกลับทาง",
          en: "Last quarter international sales rose 18.0% as reported, but only 10.1% once currency moves are stripped out. That difference can disappear if exchange rates turn.",
        },
        kind: "concentration",
      },
    ],

    valuation: {
      bear: 30.93,
      base: 47.53,
      bull: 68.78,
      ev: 47.86,
      bearP: 0.3,
      baseP: 0.45,
      bullP: 0.25,
      trigger: 38.29,
      verdictWord: { th: "ราคาสูงเกินไป", en: "Overvalued" },
    },

    variant: {
      market: {
        th: "เมื่อคำนวณย้อนกลับจากราคา 111.02 ดอลลาร์ โดยตรึงสมมติฐานอื่นไว้ที่ฉากกลาง ราคานี้ต้องการอย่างใดอย่างหนึ่งใน 4 ข้อ คือรายได้โต 17.2 เปอร์เซ็นต์ต่อปีสิบปีจนแตะ 3.5 ล้านล้านดอลลาร์ หรือกำไรจากการดำเนินงานเป็น 9.69 เปอร์เซ็นต์ของยอดขายคงที่สิบปี หรือการเติบโตตลอดกาล 6.91 เปอร์เซ็นต์ หรือคิดลดส่วนของผู้ถือหุ้นที่ 5.37 เปอร์เซ็นต์ ข้อสุดท้ายชัดที่สุด เพราะ Walmart เองจ่ายดอกเบี้ยเจ้าหนี้อยู่ราว 5.04 เปอร์เซ็นต์ แปลว่าตลาดมองว่าการเป็นเจ้าของหุ้นเสี่ยงกว่าการเป็นเจ้าหนี้เพียง 0.33 เปอร์เซ็นต์",
        en: "Reversing the arithmetic out of the $111.02 price, holding everything else at the base case, it needs one of four things: revenue growth of 17.2% a year for a decade to $3.5 trillion; a flat 9.69% operating margin for ten years; perpetual growth of 6.91%; or a 5.37% discount rate on the equity. The last is the clearest, because Walmart itself pays about 5.04% to its lenders — implying the market sees owning the shares as only 0.33 percentage points riskier than lending to the company.",
      },
      us: {
        th: "เราไม่ได้เถียงว่าเครื่องยนต์กำไรสูงไม่จริง มันจริงและโตเร็วมาก เราต่างที่ขนาดและจังหวะเวลา โฆษณา 6.4 พันล้านบวกค่าสมาชิก 4.4 พันล้าน รวมกัน 10.8 พันล้าน บนฐานยอดขาย 706.4 พันล้าน คิดเป็น 1.53 เปอร์เซ็นต์ ต่อให้ทั้งก้อนมีอัตรากำไร 50 เปอร์เซ็นต์และโตปีละ 30 เปอร์เซ็นต์ไปอีกห้าปี มันจะเพิ่มกำไรราว 10 พันล้านบนฐานรายได้ที่ตอนนั้นราว 860 พันล้าน ได้กำไรต่อยอดขายราว 5.3 เปอร์เซ็นต์ ไม่ใช่ 9.69 เปอร์เซ็นต์ และหลักฐานห้าปีที่ผ่านมาก็บอกเรื่องเดียวกัน คือกำไรต่อยอดขายไม่ขยับเลยทั้งที่โฆษณาโตเลขสองหลักสูงทุกปี",
        en: "We do not argue the high-margin engine is unreal — it is real and growing fast. We differ on size and timing. Advertising of $6.4B plus membership of $4.4B is $10.8B against $706.4B of sales, or 1.53%. Even at a 50% margin growing 30% a year for five years it would add roughly $10B of profit on a revenue base of about $860B — taking operating profit to around 5.3% of sales, not 9.69%. The last five years say the same thing: profit per dollar of sales has not moved at all, despite high double-digit advertising growth throughout.",
      },
    },

    killers: [
      {
        th: "กำไรจากการดำเนินงานเกิน 4.80% ของยอดขาย สองไตรมาสติด",
        en: "Operating profit exceeds 4.80% of sales for two consecutive quarters",
      },
      {
        th: "เงินลงทุนลดลงต่ำกว่า 3.0% ของยอดขายตลอดทั้งปี",
        en: "Capital spending falls below 3.0% of sales for a full year",
      },
      {
        th: "เงินสดหลังลงทุนย้อนหลังสิบสองเดือนกลับขึ้นเหนือ 20 พันล้านดอลลาร์",
        en: "Trailing twelve-month cash after investment returns above $20B",
      },
      {
        th: "ธุรกิจโฆษณาโตต่ำกว่า 20% สองไตรมาสติด",
        en: "Advertising growth falls below 20% for two consecutive quarters",
      },
      {
        th: "ราคาลงแตะราว 38 ดอลลาร์ ซึ่งเป็นจุดที่ช่องว่างต่อมูลค่าปิดจนน่าสนใจ",
        en: "The price reaches about $38, where the gap to value closes to an interesting level",
      },
    ],
    catalysts: [
      { when: { th: "~21 ส.ค. 2026", en: "~Aug 21, 2026" }, what: {
        th: "งบไตรมาส 2 ปีงบ 2027 บริษัทไกด์กำไรดำเนินงานโต 7–10% บนยอดขายโต 4–5% ซึ่งจะเป็นการพลิกจากไตรมาสล่าสุด",
        en: "Q2 FY2027 results — guidance asks for operating income up 7–10% on sales up 4–5%, which would reverse last quarter",
      } },
      { when: { th: "~พ.ย. 2026", en: "~Nov 2026" }, what: {
        th: "งบไตรมาส 3 เป็นไตรมาสที่สองติดที่จะบอกว่าค่าใช้จ่ายกลับมาโตช้ากว่ายอดขายหรือยัง",
        en: "Q3 results are the second consecutive read on whether costs are again growing slower than sales",
      } },
      { when: { th: "~ก.พ. 2027", en: "~Feb 2027" }, what: {
        th: "งบทั้งปีและแผนปีถัดไป ซึ่งตัวเลขเงินลงทุนปีหน้าคือตัวชี้ขาดว่าวงจรการลงทุนจบหรือยัง",
        en: "Full-year results and next year's plan, where the capital spending figure decides whether the investment cycle is over",
      } },
      { when: { th: "~มี.ค. 2027", en: "~Mar 2027" }, what: {
        th: "รายงานประจำปี ซึ่งจะบอกว่าบริษัทเริ่มแยกกำไรของธุรกิจโฆษณาและค่าสมาชิกออกมาหรือไม่",
        en: "The annual report, which will show whether the company begins disclosing advertising and membership profit separately",
      } },
    ],
    returnMath: {
      floorPct: "−15.5%",
      onTrackPct: "−9.9%",
      note: {
        th: "ตัวเลขนี้สมมติว่าราคากลับสู่มูลค่าประเมินภายใน 5 ปี โดย floor คือมูลค่าอยู่นิ่งแล้วราคาไล่ลงมาหา ส่วน on-track คือมูลค่าโตปีละ 6.56 เปอร์เซ็นต์ระหว่างที่ราคาปิดช่องว่าง ทั้งช่วงอยู่ต่ำกว่าต้นทุนส่วนของผู้ถือหุ้นที่ 8.32 เปอร์เซ็นต์อยู่ราว 18 จุดเปอร์เซ็นต์ ซึ่งเป็นนิยามเชิงตัวเลขของคำว่าถือได้แต่ห้ามเพิ่ม ข้อควรระวังคือสมมติฐานที่มีน้ำหนักที่สุดในโมเดลคือค่าความผันผวนเทียบตลาดที่ใช้ 0.80 ตามค่ากลางของภาคค้าปลีกอาหาร ถ้าใช้ 0.55 ซึ่งใกล้ค่าที่วัดจากราคาจริงของ Walmart มูลค่าจะขึ้นเป็น 62.66 ดอลลาร์ ซึ่งยังต่ำกว่าราคา 44 เปอร์เซ็นต์ ข้อสรุปจึงไม่เปลี่ยนแต่ขนาดของช่องว่างเปลี่ยน นี่ไม่ใช่ราคาเป้าหมาย",
        en: "These assume the price reverts to the estimate within five years — floor is value standing still while price falls to meet it, on-track is value compounding 6.56% a year as the gap closes. The whole range sits about 18 percentage points below the 8.32% cost of equity, which is what hold-but-do-not-add means numerically. One caveat: the model's most consequential assumption is the 0.80 market-sensitivity figure taken from the food retail sector median. At 0.55, closer to what Walmart's own share price actually shows, the value rises to $62.66 — still 44% below the price. The conclusion does not change, but the size of the gap does. This is not a price target.",
      },
    },

    sensitivity: {
      rowLabel: { th: "อัตราคิดลด (ต้นทุนเงินทุน)", en: "Discount rate (cost of capital)" },
      colLabel: { th: "อัตรากำไรจากการดำเนินงานปลายทาง", en: "Long-run operating margin" },
      rows: ["6.50%", "7.00%", "7.50%", "8.10% (Base)", "8.50%"],
      cols: ["4.2%", "4.8% (Base)", "5.4%", "6.0%"],
      grid: [
        [64, 73, 82, 91],
        [55, 63, 70, 78],
        [48, 55, 62, 68],
        [42, 48, 53, 59],
        [38, 44, 49, 54],
      ],
      baseRow: 3,
      baseCol: 1,
      caption: {
        th: "สองแกนนี้คือสิ่งที่ตัดสินหุ้นตัวนี้จริง คืออัตรากำไรปลายทางเมื่อธุรกิจโฆษณาโตเต็มที่ และอัตราคิดลดที่เหมาะกับธุรกิจที่ทนทานขนาดนี้ ทั้งตารางให้มูลค่าระหว่าง 38 ถึง 91 ดอลลาร์ และไม่มีช่องใดเลยที่ถึงราคาตลาด 111.02 ดอลลาร์ แม้ช่องที่ใจกว้างที่สุดคืออัตรากำไร 6.0 เปอร์เซ็นต์ซึ่งเหนือจุดสูงสุดตลอดกาล คู่กับอัตราคิดลด 6.5 เปอร์เซ็นต์ ก็ยังได้เพียง 91 ดอลลาร์ กรอบเข้ม = Base",
        en: "These two axes are what actually decide this stock: the margin that survives once advertising has scaled, and the discount rate appropriate to a business this durable. The table spans $38 to $91 and not a single cell reaches the $111.02 market price. Even the most generous — a 6.0% margin, above the all-time peak, at a 6.5% discount rate — reaches only $91. Bold box = Base.",
      },
    },

    onePager: {
      th: "Walmart เพิ่งรายงานไตรมาสที่ดูดีเกือบทุกด้าน รายได้ 177.8 พันล้านดอลลาร์ เพิ่มขึ้น 7.3 เปอร์เซ็นต์ ยอดขายสาขาเดิมในสหรัฐโต 4.1 เปอร์เซ็นต์ โดยจำนวนครั้งที่คนเดินเข้าร้านเพิ่มขึ้น 3.0 เปอร์เซ็นต์ ซึ่งสำคัญกว่าตัวเลขยอดขาย เพราะมันบอกว่าลูกค้ามาเพิ่มจริง ไม่ใช่แค่ของแพงขึ้น การขายออนไลน์โต 26 เปอร์เซ็นต์ทั่วโลกและทำกำไรแล้ว ธุรกิจโฆษณาที่ Walmart เก็บเงินจากผู้ผลิตสินค้าโต 37 เปอร์เซ็นต์ ค่าสมาชิกโต 17.4 เปอร์เซ็นต์ บริษัทได้อันดับเครดิต AA จากทั้งสามสำนักจัดอันดับ และกู้เงินสิบปีได้ที่ดอกเบี้ยเพียง 4.76 เปอร์เซ็นต์ ซึ่งถูกที่สุดกลุ่มหนึ่งในอเมริกา เราให้คะแนนคุณภาพ 74 เต็ม 100 อยู่ระดับสูง แต่มีข้อเท็จจริงหนึ่งที่ตัวเลขข้างบนกลบไว้ คือเงินสดที่เหลือหลังหักการลงทุนของ Walmart ลดลง 42 เปอร์เซ็นต์ในห้าปี จาก 25.8 พันล้านดอลลาร์เหลือ 14.9 พันล้าน ทั้งที่ยอดขายเพิ่มขึ้น 27 เปอร์เซ็นต์ในช่วงเดียวกัน สาเหตุคือเงินลงทุนที่เพิ่มจาก 10.3 พันล้านเป็น 26.6 พันล้าน หรือ 160 เปอร์เซ็นต์ บริษัทกำลังสร้างคลังสินค้าอัตโนมัติและระบบส่งของ และบอกว่าจะใช้เงินระดับ 3.5 เปอร์เซ็นต์ของยอดขายต่อไปโดยไม่ระบุว่าจะจบเมื่อไหร่ ไตรมาสล่าสุดเงินสดหลังลงทุนติดลบ 1.95 พันล้านดอลลาร์ จากที่เคยเป็นบวก และค่าใช้จ่ายโต 8.9 เปอร์เซ็นต์เร็วกว่ายอดขายที่โต 7.1 เปอร์เซ็นต์ คำถามเดียวที่ตัดสินหุ้นตัวนี้คือ เครื่องยนต์กำไรสูงที่กำลังโตเร็วจะดันกำไรต่อยอดขายขึ้นได้ถึงระดับไหน ปัจจุบัน Walmart เก็บกำไรจากการดำเนินงานได้ 4.15 ดอลลาร์จากทุก 100 ดอลลาร์ที่ขาย ที่ราคา 111.02 ดอลลาร์ เราคำนวณย้อนกลับแล้วพบว่าราคานี้ฝังสมมติฐานว่าตัวเลขนั้นจะเป็น 9.69 ดอลลาร์ และคงอยู่อย่างนั้นสิบปี จุดสูงสุดตลอดกาลของ Walmart อยู่ราว 5.9 และห้าปีล่าสุดตัวเลขนี้อยู่ในกรอบ 4.0 ถึง 4.6 ไม่ขยับเลย ทั้งที่ธุรกิจโฆษณาโตเลขสองหลักสูงตลอดช่วงนั้น เหตุผลคือขนาด โฆษณา 6.4 พันล้านบวกค่าสมาชิก 4.4 พันล้าน รวมกันคิดเป็นเพียง 1.53 เปอร์เซ็นต์ของยอดขาย ยังเล็กเกินกว่าจะกลบต้นทุนการส่งของและค่าเสื่อมจากเครื่องจักรที่เพิ่งซื้อมา อีกวิธีคำนวณย้อนกลับให้ภาพที่ชัดกว่า ราคานี้ถูกต้องได้ก็ต่อเมื่อคิดลดส่วนของผู้ถือหุ้น Walmart ที่ 5.37 เปอร์เซ็นต์ต่อปี ขณะที่ Walmart เองจ่ายดอกเบี้ยเจ้าหนี้อยู่ราว 5.04 เปอร์เซ็นต์ เราประเมินสามฉากได้ 30.93 ดอลลาร์ในฉากแย่ 47.53 ในฉากกลาง และ 68.78 ในฉากดี ถ่วงน้ำหนักแล้วได้ 47.86 ดอลลาร์ หรือ 0.43 ของราคา เราทดสอบด้วยการดันสมมติฐานทุกข้อไปทางบวก ทั้งใช้ค่าความผันผวนต่ำแบบหุ้นปลอดภัย ทั้งให้กำไรต่อยอดขายกลับไปที่จุดสูงสุดตลอดกาล ทั้งให้การลงทุนจบทันที ได้ 81.93 ดอลลาร์ ยังไม่ถึงราคา ต้องเพิ่มสมมติฐานว่ารายได้จะโตปีละ 8 เปอร์เซ็นต์ ซึ่งเป็นสองเท่าของที่บริษัทเองบอกไว้ จึงจะได้ 107.54 ใกล้ราคา สิ่งที่ทำให้เคสนี้ต่างจากหุ้นตัวอื่นที่เราวิเคราะห์คือทุกวิธีวัดชี้ไปทางเดียวกัน โมเดลกระแสเงินสดบอก 47.86 การเทียบกับบริษัทคู่แข่งบอก 62.47 ผลตอบแทนเงินสดต่อราคาอยู่ที่ 1.42 เปอร์เซ็นต์เทียบกับ 8.32 เปอร์เซ็นต์ที่ควรได้จากการถือหุ้น และเมื่อวัดด้วยราคาต่อกระแสเงินสด Walmart แพงที่สุดในกลุ่ม แพงกว่า Costco ที่ทุกคนบอกว่าแพงอยู่แล้ว ข้อสรุปคือถือได้ แต่ห้ามเพิ่ม และไม่ใช่ขาย เพราะธุรกิจนี้แข็งแรงจริง ชนะส่วนแบ่งจริง และสิ่งที่กำลังสร้างอาจได้ผลจริงในอีกหลายปี แต่ราคาวันนี้ได้จ่ายค่าความสำเร็จนั้นล่วงหน้าไปหมดแล้ว สิ่งที่ควรเฝ้าคือวันที่ 21 สิงหาคม 2026 เมื่องบไตรมาสหน้าจะบอกว่ากำไรต่อยอดขายเริ่มขยับหรือยัง",
      en: "Walmart just reported a quarter that looks good almost everywhere. Revenue of $177.8 billion, up 7.3%. U.S. same-store sales grew 4.1%, with the number of store visits up 3.0% — which matters more than the sales figure, because it says more customers actually came, not just that goods cost more. Online sales grew 26% globally and are now profitable. The advertising business, where Walmart charges brands to promote products on its own platform, grew 37%, and membership fees 17.4%. All three rating agencies rate the company AA, and it borrows for ten years at just 4.76%, among the cheapest in America. We score quality 74 out of 100, in the high band. But one fact is buried under those numbers: the cash Walmart has left after investment has fallen 42% in five years, from $25.8 billion to $14.9 billion, even though sales grew 27% over the same period. The cause is capital spending, up from $10.3 billion to $26.6 billion, or 160%. The company is building automated warehouses and delivery systems, and says it will keep spending around 3.5% of sales with no stated end date. Last quarter cash after investment was negative $1.95 billion, down from positive, and costs grew 8.9% against sales growth of 7.1%. The single question that decides this stock is how far the fast-growing high-margin engine can push profit per dollar of sales. Today Walmart keeps $4.15 of operating profit from every $100 it sells. At $111.02, reversing the arithmetic shows the price embeds that figure becoming $9.69 and staying there for ten years. Walmart's all-time peak is about $5.90, and for five years the number has sat between $4.00 and $4.60 without moving — despite high double-digit advertising growth throughout. The reason is size: advertising of $6.4 billion plus membership of $4.4 billion is just 1.53% of sales, still too small to offset the cost of delivery and the depreciation on newly bought equipment. Another reversal makes it plainer still: this price is only right if Walmart's equity is discounted at 5.37% a year, while Walmart itself pays lenders about 5.04%. Our three scenarios give $30.93, $47.53 and $68.78, weighting to $47.86, or 0.43 of the price. We stress-tested by pushing every assumption in the company's favour — a low market-sensitivity figure, profit per dollar of sales back at its all-time peak, investment ending immediately — and reached $81.93, still short. Only by also assuming revenue grows 8% a year, double what the company itself guides, does it reach $107.54. What makes this case different from the others we have analysed is that every measure points the same way: the cash flow model says $47.86, the peer comparison says $62.47, the cash return on the price is 1.42% against the 8.32% a shareholder should require, and on price-to-cash-flow Walmart is the most expensive in its peer group — more expensive than Costco, which everyone already calls expensive. The conclusion is hold, not add, and not sell, because the business is genuinely strong, is genuinely winning share, and what it is building may genuinely work in a few years. But today's price has already paid for that success in advance. The date to watch is 21 August 2026, when the next results will show whether profit per dollar of sales has started to move.",
    },

    sources: [
      { label: "Walmart Form 10-Q ไตรมาส 1 ปีงบ 2027 (งวดสิ้นสุด 30 เม.ย. 2026)", url: "https://www.sec.gov/Archives/edgar/data/0000104169/000010416926000102/wmt-20260430.htm" },
      { label: "8-K Exhibit 99.1 — ผลประกอบการ Q1 FY2027 (21 พ.ค. 2026)", url: "https://www.sec.gov/Archives/edgar/data/104169/000010416926000095/earningsreleasefy27q1.htm" },
      { label: "Form FWP — Final Term Sheet หุ้นกู้ 27 เม.ย. 2026 (ที่มาของ spread 43bp)", url: "https://www.sec.gov/Archives/edgar/data/0000104169/000119312526183374/d145944dfwp.htm" },
      { label: "SEC EDGAR XBRL Company Facts (CIK 0000104169)", url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000104169.json" },
      { label: "Damodaran — Betas by Sector (Retail Grocery and Food, unlevered 0.80)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/Betas.html" },
      { label: "Damodaran — Country Equity Risk Premiums (US 4.46%)", url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html" },
    ],
    pdfUrl: "/reports/wmt-deep-o-v42.pdf",
  },
];

export const getReport = (ticker: string): StockReport | undefined =>
  REPORTS.find((r) => r.ticker.toLowerCase() === ticker.toLowerCase());

// Upside of E[V] vs a live price, as a signed fraction (0.13 = +13%).
export const upsideVs = (ev: number, price: number): number => ev / price - 1;
