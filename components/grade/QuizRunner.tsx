"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  cacheQuizResult,
  type GradedQuestion,
  type PublicQuizQuestion,
  type QuizMeta,
  type QuizSubmitResult,
} from "@/lib/grade/quiz-public";

export default function QuizRunner({ meta }: { meta: QuizMeta }) {
  const [questions, setQuestions] = useState<PublicQuizQuestion[] | null>(null);
  const [responses, setResponses] = useState<Record<string, number | null>>({});
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Questions come from the server because the answers stay there — drawing
  // them here would mean shipping the bank, answers included, to the browser.
  const draw = useCallback(async () => {
    setQuestions(null);
    setResponses({});
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/grade/quiz/draw?level=${meta.level}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "โหลดแบบทดสอบไม่สำเร็จ");
        return;
      }
      setQuestions(data.questions as PublicQuizQuestion[]);
    } catch {
      setError("โหลดแบบทดสอบไม่สำเร็จ — ตรวจสอบการเชื่อมต่อแล้วลองใหม่");
    }
  }, [meta.level]);

  useEffect(() => {
    draw();
  }, [draw]);

  const submit = async () => {
    if (!questions) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/grade/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: meta.level,
          questionIds: questions.map((q) => q.id),
          responses,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ส่งคำตอบไม่สำเร็จ");
        return;
      }
      const submitted = data as QuizSubmitResult;
      setResult(submitted);
      cacheQuizResult(meta.level, submitted.percent, submitted.passed);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("ส่งคำตอบไม่สำเร็จ — ตรวจสอบการเชื่อมต่อแล้วลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !questions) {
    return (
      <div className="qz qz-loading">
        <p>{error}</p>
        <button type="button" className="qz-btn" onClick={draw}>
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!questions) {
    return <div className="qz qz-loading">กำลังสุ่มข้อสอบ…</div>;
  }

  const gradedById = new Map<string, GradedQuestion>(
    (result?.graded ?? []).map((g) => [g.id, g]),
  );
  const answeredCount = questions.filter((q) => responses[q.id] != null).length;
  const submitted = result != null;

  return (
    <div className="qz">
      {submitted ? (
        <div className={`qz-result ${result.passed ? "pass" : "fail"}`}>
          <span className="qz-result-kicker">{result.passed ? "ผ่าน" : "ยังไม่ผ่าน"}</span>
          <strong>{result.percent}%</strong>
          <p>
            ตอบถูก {result.correctCount} จาก {result.total} ข้อ · เกณฑ์ผ่าน {meta.passPercent}%
          </p>
          {!result.passed ? (
            <p className="qz-result-note">
              อ่านคำอธิบายด้านล่างแล้วลองใหม่ได้ไม่จำกัด — คำถามจะสุ่มชุดใหม่ทุกครั้ง
            </p>
          ) : null}
          {!result.saved ? (
            <p className="qz-result-note">
              ผลนี้ยังไม่ถูกบันทึก — เข้าสู่ระบบก่อนทำแบบทดสอบเพื่อเก็บผลไว้ในบัญชีของคุณ
            </p>
          ) : null}
          <div className="qz-result-actions">
            <button type="button" className="qz-btn" onClick={draw}>
              ทำใหม่ (สุ่มข้อใหม่)
            </button>
            <Link href="/grade" className="qz-btn qz-btn-ghost">
              กลับหน้าหลักสูตร
            </Link>
          </div>
        </div>
      ) : (
        <div className="qz-head">
          <p>{meta.intro}</p>
          <span>
            {questions.length} ข้อ · ผ่านที่ {meta.passPercent}% · ทำใหม่ได้ไม่จำกัด
          </span>
        </div>
      )}

      <ol className="qz-list">
        {questions.map((q, index) => {
          const response = responses[q.id] ?? null;
          const graded = gradedById.get(q.id);
          const right = graded?.correct ?? false;
          return (
            <li
              key={q.id}
              className={`qz-q ${submitted ? (right ? "is-right" : "is-wrong") : ""}`}
            >
              <div className="qz-q-head">
                <span className="qz-num">{index + 1}</span>
                <p className="qz-prompt">{q.prompt}</p>
              </div>

              {q.setup ? <pre className="qz-setup">{q.setup}</pre> : null}

              {q.type === "choice" ? (
                <div className="qz-choices">
                  {q.choices.map((choice, choiceIndex) => {
                    const selected = response === choiceIndex;
                    const isAnswer = submitted && graded?.answer === choiceIndex;
                    return (
                      <label
                        key={choiceIndex}
                        className={`qz-choice ${selected ? "is-selected" : ""} ${isAnswer ? "is-answer" : ""}`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={selected}
                          disabled={submitted}
                          onChange={() => setResponses((r) => ({ ...r, [q.id]: choiceIndex }))}
                        />
                        <span>{choice}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="qz-numeric">
                  <input
                    type="number"
                    step="any"
                    inputMode="decimal"
                    disabled={submitted}
                    value={response ?? ""}
                    placeholder="ตอบเป็นตัวเลข"
                    onChange={(e) =>
                      setResponses((r) => ({
                        ...r,
                        [q.id]: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    aria-label={q.prompt}
                  />
                  {q.unit ? <span className="qz-unit">{q.unit}</span> : null}
                </div>
              )}

              {submitted && graded ? (
                <div className="qz-explain">
                  <b>{right ? "ถูก" : "ยังไม่ถูก"}</b>
                  {q.type === "numeric" && !right ? (
                    <p className="qz-answer-line">
                      คำตอบ: {graded.answer}
                      {q.unit ? ` ${q.unit}` : ""}
                    </p>
                  ) : null}
                  <p>{graded.explain}</p>
                  <Link href={graded.ref}>ทบทวนบทเรียนที่เกี่ยวข้อง →</Link>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {!submitted ? (
        <div className="qz-submit">
          <span>
            ตอบแล้ว {answeredCount}/{questions.length} ข้อ
          </span>
          {error ? <span className="qz-error">{error}</span> : null}
          <button
            type="button"
            className="qz-btn"
            disabled={answeredCount < questions.length || submitting}
            onClick={submit}
          >
            {submitting ? "กำลังตรวจ…" : "ส่งคำตอบ"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
