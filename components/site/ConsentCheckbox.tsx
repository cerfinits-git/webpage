"use client";

import Link from "next/link";
import { CONSENT_PURPOSES } from "@/lib/legal";

/**
 * The consent control every email form shares.
 *
 * PDPA s.19 wants consent that is explicit, separated from other text, and
 * informed. That rules out three shortcuts this site could have taken:
 * a pre-ticked box (inaction is not consent), consent bundled into the terms
 * (it has to stand apart from them), and a bare "I agree" with the purposes
 * hidden behind a link. So the box starts empty, sits in its own bordered
 * area, and lists what the address will be used for right next to itself.
 */
export default function ConsentCheckbox({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="consent">
      <label className="consent-row" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          name="consent"
          checked={checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
        />
        <span>ยินยอมให้เก็บอีเมลของฉันเพื่อวัตถุประสงค์ด้านล่าง</span>
      </label>
      <ul className="consent-purposes">
        {CONSENT_PURPOSES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <p className="consent-note">
        ถอนความยินยอมได้ทุกเมื่อที่ <Link href="/unsubscribe">หน้ายกเลิกรับอีเมล</Link>{" "}
        ซึ่งจะลบอีเมลออกถาวร · อ่าน <Link href="/privacy">นโยบายความเป็นส่วนตัว</Link>
      </p>
    </div>
  );
}
