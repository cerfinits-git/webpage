"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AXES,
  AXIS_ORDER,
  DEAD_ZONE,
  QUESTIONS,
  frameFor,
  scoreQuiz,
  type AxisId,
  type QuizResult,
} from "@/lib/grade/archetypes";
import ConsentCheckbox from "./ConsentCheckbox";
import { renderShareCard, shareFileName } from "@/lib/grade/share-card";
import { CONSENT_VERSION } from "@/lib/legal";

const shareLabel = {
  idle: "แชร์การ์ดนี้",
  busy: "กำลังสร้างรูป…",
  saved: "บันทึกรูปแล้ว",
  error: "ลองอีกครั้ง",
} as const;

/** แถบสเกลต่อเนื่องของหนึ่งแกน — จุดที่ MBTI ทำพลาดคือตัดกลางเป็นสองฝั่งเงียบ ๆ */
function AxisMeter({ result }: { result: QuizResult["axes"][AxisId] }) {
  const { axis, score, side, borderline } = result;
  // −100..+100 → 0..100 สำหรับตำแหน่งซ้าย-ขวา
  const left = (score + 100) / 2;

  return (
    <div className="aq-axis">
      <div className="aq-axis-head">
        <span className="aq-axis-title">
          <span className="aq-axis-letter">{side.code}</span>
          {axis.title}
        </span>
        {borderline ? <span className="aq-axis-flag">อยู่กลางแกน</span> : null}
      </div>
      <div className="aq-axis-track">
        <span className="aq-axis-mid" />
        <span className="aq-axis-dot" style={{ left: `${left}%` }} />
      </div>
      <div className="aq-axis-ends">
        <span className={score <= 0 ? "on" : ""}>
          {axis.negative.code} · {axis.negative.label}
        </span>
        <span className={score > 0 ? "on" : ""}>
          {axis.positive.label} · {axis.positive.code}
        </span>
      </div>
    </div>
  );
}

function EmailCapture({ archetype }: { archetype: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [consent, setConsent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          botField: String(data.get("bot-field") ?? ""),
          source: "quiz",
          archetype,
          consent: true,
          consentVersion: CONSENT_VERSION,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="aq-mail aq-mail-ok">
        <strong>บันทึกอีเมลเรียบร้อย</strong>
        <p>บทเรียนใหม่และงานวิจัยที่ทำเสร็จจะส่งไปที่อีเมลนี้ ยกเลิกได้ทุกเมื่อ</p>
      </div>
    );
  }

  return (
    <div className="aq-mail">
      <strong>รับบทเรียนใหม่ทางอีเมล</strong>
      <p>
        ระดับ 1–4 ของหลักสูตรเปิดให้อ่านฟรีอยู่แล้ว — อีเมลใช้ส่งบทเรียนใหม่และงานวิจัยที่ทำเสร็จ
        ไม่บังคับกรอกเพื่อดูผล
      </p>
      <form className="aq-mail-form" onSubmit={submit}>
        <p className="hp">
          <label>
            Don&apos;t fill this out: <input name="bot-field" />
          </label>
        </p>
        <input type="email" name="email" required placeholder="you@email.com" aria-label="อีเมล" />
        <button type="submit" className="aq-btn" disabled={state === "busy" || !consent}>
          {state === "busy" ? "กำลังส่ง…" : "รับบทเรียน"}
        </button>
      </form>
      <ConsentCheckbox id="quiz-consent" checked={consent} onChange={setConsent} />
      <p className="aq-mail-note">
        เก็บเฉพาะอีเมลและรหัสประเภทที่คุณได้ ({archetype}) ไม่เก็บคำตอบรายข้อ
        และไม่ส่งต่อให้บุคคลที่สาม
      </p>
      {state === "error" ? (
        <p className="aq-mail-err" role="alert">
          ส่งไม่สำเร็จ — ลองอีกครั้งได้
        </p>
      ) : null}
    </div>
  );
}

function Result({ result, onRetry }: { result: QuizResult; onRetry: () => void }) {
  const { archetype, code, axes, borderlineAxes, dominantRisk } = result;
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState<"idle" | "busy" | "saved" | "error">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/quiz`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  /**
   * Hands over a real image file rather than a link. On a phone that opens the
   * system share sheet with Instagram in it, which is the whole point; browsers
   * without file sharing — desktop, mostly — save the PNG instead.
   */
  async function share() {
    setSharing("busy");
    try {
      const blob = await renderShareCard(archetype);
      const file = new File([blob], shareFileName(code), { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `ผมเป็นเทรดเดอร์แบบ ${archetype.name}`,
          text: `${code} · ${archetype.name} — ทำแบบทดสอบได้ที่ cerfinits.com/quiz`,
        });
        setSharing("idle");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = shareFileName(code);
      link.click();
      URL.revokeObjectURL(url);
      setSharing("saved");
    } catch (err) {
      // Dismissing the share sheet rejects too, and that is not a failure.
      if (err instanceof DOMException && err.name === "AbortError") {
        setSharing("idle");
        return;
      }
      setSharing("error");
    }
  }

  return (
    <div className="aq-result">
      {/* การ์ดถูกออกแบบให้แคปหน้าจอแล้วโพสต์ได้ทันที — สัดส่วน 2:3 เท่ากับกรอบ
          และมีครบทั้งรหัส ชื่อ ตัวละคร และที่อยู่เว็บในเฟรมเดียว สีกรอบมาจาก
          frameFor() ไม่ใช่ของประดับ แต่บอกกลุ่มความเสี่ยงตามแกน 1 คูณแกน 3 */}
      <figure className="aq-card" data-frame={frameFor(code)}>
        <span className="aq-card-code">
          {code.split("").map((letter, i) => (
            <span key={`${letter}-${i}`}>{letter}</span>
          ))}
        </span>

        <div className="aq-card-art">
          {/* CSS ย่อภาพลงจากขนาดที่ประกาศไว้ ต้องบอก sizes ไม่งั้นเบราว์เซอร์เลือก
              ไฟล์ตามความกว้างที่ประกาศ แล้วจอความละเอียดสูงจะได้ภาพเบลอ */}
          <Image
            src={`/quiz/archetypes/${code}.webp`}
            alt={`ภาพประจำประเภท ${archetype.name}`}
            width={440}
            height={660}
            sizes="(min-width: 560px) 420px, 88vw"
            priority
          />
        </div>

        <figcaption className="aq-card-body">
          <h2>{archetype.name}</h2>
          <span className="aq-card-en">{archetype.english}</span>
          <p className="aq-card-tag">{archetype.tagline}</p>
          <span className="aq-card-mark">cerfinits.com/quiz</span>
        </figcaption>
      </figure>

      <div className="aq-axes">
        {AXIS_ORDER.map((id) => (
          <AxisMeter key={id} result={axes[id]} />
        ))}
      </div>

      {borderlineAxes.length > 0 ? (
        <p className="aq-borderline">
          คะแนนของคุณอยู่ใกล้กลางแกน (ห่างจากกลางไม่ถึง {DEAD_ZONE} จาก 100) ในแกน
          {borderlineAxes.map((id, i) => (
            <b key={id}>
              {/* จุลภาคคั่นระหว่างกลาง และ "และ" เฉพาะตัวสุดท้าย */}
              {i === 0 ? " " : i === borderlineAxes.length - 1 ? " และ" : ", "}
              {AXES[id].title}
            </b>
          ))}{" "}
          — ตัวอักษร{borderlineAxes.length > 1 ? "เหล่านั้น" : "นั้น"}จึงพลิกได้ถ้าทำแบบทดสอบซ้ำ
          ให้อ่านคำอธิบายของทั้งสองฝั่งประกอบ ไม่ต้องยึดรหัสเดียว
        </p>
      ) : null}

      <section className="aq-block">
        <h3>คุณทำอะไรอยู่</h3>
        <p>{archetype.behaviour}</p>
      </section>

      <section className="aq-block">
        <h3>สิ่งที่เป็นข้อดี</h3>
        <p>{archetype.strength}</p>
      </section>

      <section className="aq-block aq-block-weak">
        <h3>จุดที่ทำให้เสียเงิน</h3>
        <p>{archetype.weakness}</p>
        <p className="aq-evidence">
          <span>หลักฐาน · {dominantRisk.label}</span>
          {dominantRisk.evidence}
        </p>
      </section>

      <section className="aq-block">
        <h3>อ่านสามบทนี้ก่อน</h3>
        <p className="aq-block-sub">
          เลือกมาจากจุดอ่อนข้างต้น ทั้งสามบทอยู่ในระดับ 1–4 ของ Cerfinits Grade
          ซึ่งอ่านได้โดยไม่มีค่าใช้จ่าย
        </p>
        <ol className="aq-chapters">
          {archetype.chapters.map((c) => (
            <li key={c.href}>
              <Link href={c.href}>
                <span className="aq-ch-n">{c.n}</span>
                <span className="aq-ch-t">{c.title}</span>
              </Link>
              <span className="aq-ch-why">{c.why}</span>
            </li>
          ))}
        </ol>
      </section>

      <EmailCapture archetype={code} />

      <div className="aq-share">
        <button type="button" className="aq-btn" onClick={share} disabled={sharing !== "idle"}>
          {shareLabel[sharing]}
        </button>
        <span className="aq-share-note">
          บนมือถือจะเปิดเมนูแชร์ให้เลือกลง IG ได้เลย · บนคอมจะบันทึกเป็นไฟล์รูป
        </span>
        {sharing === "error" ? (
          <p className="aq-share-err" role="alert">
            สร้างรูปไม่สำเร็จ — แคปหน้าจอการ์ดด้านบนแทนได้
          </p>
        ) : null}
      </div>

      <div className="aq-after">
        <button type="button" className="aq-btn aq-btn-ghost" onClick={copyLink}>
          {copied ? "คัดลอกลิงก์แล้ว" : "คัดลอกลิงก์ชวนเพื่อนทำ"}
        </button>
        <Link href="/grade" className="aq-btn aq-btn-ghost">
          ดูหลักสูตรทั้ง 8 ระดับ
        </Link>
        <button type="button" className="aq-btn aq-btn-plain" onClick={onRetry}>
          ทำใหม่
        </button>
      </div>

      <p className="aq-disclaim">
        แบบทดสอบนี้อธิบายพฤติกรรมการเทรดที่คุณรายงานเอง ไม่ใช่คำแนะนำการลงทุน
        ไม่ประเมินความเหมาะสมในการลงทุนของคุณ และไม่ทำนายผลตอบแทน — ผลลัพธ์เปลี่ยนได้
        เมื่อพฤติกรรมเปลี่ยน ไม่ใช่คุณสมบัติติดตัว
      </p>
    </div>
  );
}

export default function ArchetypeQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;

  if (done) {
    return (
      <Result
        result={scoreQuiz(answers)}
        onRetry={() => {
          setAnswers({});
          setStep(0);
          setDone(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  const q = QUESTIONS[step];
  const axis = AXES[q.axis];
  const axisIndex = AXIS_ORDER.indexOf(q.axis);

  function choose(value: number) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step + 1 >= total) {
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="aq">
      <div className="aq-progress">
        <span className="aq-progress-text">
          ข้อ {step + 1} จาก {total} · ส่วนที่ {axisIndex + 1} จาก {AXIS_ORDER.length} ·{" "}
          {axis.title}
        </span>
        <span className="aq-progress-bar">
          <span style={{ width: `${((step + 1) / total) * 100}%` }} />
        </span>
      </div>

      <div className="aq-q" key={q.id}>
        <p className="aq-q-setup">{q.setup}</p>
        <h2 className="aq-q-prompt">{q.prompt}</h2>
        <div className="aq-choices">
          {q.choices.map((c) => (
            <button type="button" key={c.text} className="aq-choice" onClick={() => choose(c.value)}>
              {c.text}
            </button>
          ))}
        </div>
      </div>

      {step > 0 ? (
        <button type="button" className="aq-btn aq-btn-plain" onClick={() => setStep(step - 1)}>
          ย้อนกลับ
        </button>
      ) : null}
    </div>
  );
}
