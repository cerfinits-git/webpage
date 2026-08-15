// The rendered half of the mobile audit. Its companion, scripts/mobile-audit.mjs,
// reads what the CSS declares; this measures what the browser actually lays out,
// which is the only place tap-target sizes and real overflow can be observed.
//
// Usage: start the dev server, open any page of it, paste this file into the
// devtools console, then call it with the routes to measure:
//
//   await mobileAudit(["/", "/research", "/research/nvda"])
//   await mobileAudit(mobileAudit.ROUTES)          // the whole public site
//   await mobileAudit(mobileAudit.ROUTES, { width: 320 })
//
// Each route is loaded into an iframe of phone width. An iframe carries its own
// viewport, so `max-width` media queries resolve against that width — the
// measurements are the ones a phone would produce, without a device farm or a
// headless-browser dependency this project does not otherwise need.
//
// Thresholds match the static audit: 14px of type, 40px of touch target. The
// 40px figure is the lower bound in the platform guidance (Apple asks 44, WCAG
// 2.5.8 asks 24 as a floor); anything under it is reported.

(function () {
  const FLOOR_PX = 14;
  const TAP_PX = 40;

  /** The public site. `/plan` and `/journal` are out of scope — see the .mjs. */
  const ROUTES = [
    "/",
    "/products",
    "/blog",
    "/blog/cot-gold-basics",
    "/blog/ict-market-maker-basics",
    "/blog/trading-psychology-discipline",
    "/algo/sdv1",
    "/research",
    "/research/methodology",
    "/research/nvda",
    "/research/nvda/advanced",
    "/grade",
    "/grade/reality-check",
    "/grade/risk-math",
    "/grade/position-sizing",
    "/grade/chart-patterns",
    "/grade/macro-fundamentals",
    "/grade/checkpoint/1",
    "/gold-start",
    "/gold-start/ch03",
    "/gold-start/cheatsheet",
    "/gold-start/glossary",
    "/gold-start/full",
  ];

  function describe(el) {
    const cls = (el.className || "").toString().trim().split(/\s+/).slice(0, 2).join(".");
    return el.tagName.toLowerCase() + (cls ? "." + cls : "");
  }

  async function mobileAudit(routes, { width = 375, height = 812, settle = 900 } = {}) {
    const frame = document.createElement("iframe");
    frame.style.cssText = `position:fixed;left:-4000px;top:0;width:${width}px;height:${height}px;border:0`;
    document.body.appendChild(frame);

    const rows = [];
    try {
      for (const route of routes) {
        await new Promise((resolve) => {
          frame.onload = () => setTimeout(resolve, settle);
          frame.src = route;
        });
        const doc = frame.contentDocument;
        const win = frame.contentWindow;
        const vw = doc.documentElement.clientWidth;
        const row = { route, scrollW: doc.documentElement.scrollWidth, overflow: [], clipped: [], taps: [], tinyType: 0 };

        for (const el of doc.querySelectorAll("body *")) {
          const box = el.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) continue;
          const style = win.getComputedStyle(el);

          // Wider than the viewport, and not deliberately parked off-screen
          // (honeypot fields, marquee tracks) or fixed to it.
          if (box.right > vw + 1 && box.left > -1 && style.position !== "fixed" && !el.closest(".ticker-track")) {
            row.overflow.push(`${describe(el)} w=${Math.round(box.width)}`);
          }
          // Content wider than its box with no way to scroll to it: cut off.
          // A marquee, an ambient gradient and a honeypot field are all wider
          // than their box on purpose — clipping is the effect, not a fault.
          if (
            el.scrollWidth > el.clientWidth + 2 &&
            style.overflowX === "hidden" &&
            !el.matches(".ticker, .hero-ambient, .hp") &&
            !el.closest(".ticker, .hp")
          ) {
            row.clipped.push(`${describe(el)} ${el.scrollWidth}>${el.clientWidth}`);
          }
          const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          if (hasOwnText && parseFloat(style.fontSize) < FLOOR_PX) row.tinyType += 1;
        }

        for (const el of doc.querySelectorAll("a,button,input,select,summary,[role=button]")) {
          const box = el.getBoundingClientRect();
          if (box.width === 0 || box.height === 0) continue;
          // The honeypot is parked off-screen for bots, not for readers. A link
          // inside a sentence is exempt under WCAG 2.5.8 — padding a run of
          // inline text to 44px breaks the line it sits in. And a control that
          // sits inside its own label inherits the label's target: the quiz
          // radio is 20px, the label around it is 261x68.
          if (el.closest(".hp")) continue;
          if (el.tagName === "A" && el.closest("p")) continue;
          if (el.closest("label") && el.closest("label").getBoundingClientRect().height >= TAP_PX) continue;
          if (box.height < TAP_PX || box.width < TAP_PX) {
            row.taps.push(`${describe(el)} ${Math.round(box.width)}x${Math.round(box.height)}`);
          }
        }

        // A text field under 16px makes iOS Safari zoom the page on focus, and
        // the reader has to pinch back out to see the form they are filling in.
        // Only fields that raise a keyboard do this — counting radios and
        // checkboxes here reported 48 offences on the quiz page that no reader
        // would ever have met.
        const TYPING = ["text", "search", "email", "password", "number", "tel", "url", "date", "datetime-local"];
        row.zoomingInputs = [...doc.querySelectorAll("input,select,textarea")].filter((el) => {
          const type = (el.type || "text").toLowerCase();
          if (el.tagName === "INPUT" && !TYPING.includes(type)) return false;
          if (el.offsetParent === null || el.closest(".hp")) return false;
          return parseFloat(win.getComputedStyle(el).fontSize) < 16;
        }).length;

        rows.push(row);
      }
    } finally {
      frame.remove();
    }

    const total = (key) => rows.reduce((n, r) => n + (Array.isArray(r[key]) ? r[key].length : r[key]), 0);
    console.table(
      rows.map((r) => ({
        route: r.route,
        overflow: r.overflow.length,
        clipped: r.clipped.length,
        "taps<40": r.taps.length,
        "type<14": r.tinyType,
        "inputs<16": r.zoomingInputs,
      })),
    );
    return {
      width,
      totals: {
        overflow: total("overflow"),
        clipped: total("clipped"),
        smallTaps: total("taps"),
        tinyType: total("tinyType"),
        zoomingInputs: total("zoomingInputs"),
      },
      rows,
    };
  }

  mobileAudit.ROUTES = ROUTES;
  window.mobileAudit = mobileAudit;
  return "mobileAudit(routes, {width}) ready — try mobileAudit(mobileAudit.ROUTES)";
})();
