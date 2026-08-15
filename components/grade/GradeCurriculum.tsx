"use client";

import { useEffect, useMemo, useState } from "react";
import { CURRICULUM, getFlatChapters } from "@/lib/grade/curriculum";
import {
  hasQuiz,
  mergeQuizResults,
  readQuizResults,
  QUIZ_ASK_COUNT,
  QUIZ_LEVELS,
  QUIZ_PASS_PERCENT,
  QUIZ_UPDATED_EVENT,
  type QuizResults,
} from "@/lib/grade/quiz-public";

export default function GradeCurriculum({
  isLoggedIn,
  initialCompleted = [],
}: {
  isLoggedIn: boolean;
  initialCompleted?: string[];
}) {
  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [quizResults, setQuizResults] = useState<QuizResults>({});
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [touchedGroup, setTouchedGroup] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const totalChapters = getFlatChapters().length;

  useEffect(() => {
    const checkProgress = async () => {
      if (!isLoggedIn) {
        setCompleted([]);
        return;
      }
      try {
        const res = await fetch("/api/user/progress");
        const data = await res.json();
        if (data.completedChapters && Array.isArray(data.completedChapters)) {
          setCompleted(data.completedChapters);
          localStorage.setItem("cerfinits_grade_progress", JSON.stringify(data.completedChapters));
          return;
        }
      } catch (err) {
        // Fallback to local storage if network request fails
      }
      const local = JSON.parse(localStorage.getItem("cerfinits_grade_progress") || "[]");
      setCompleted(local.length > 0 ? local : initialCompleted);
    };
    checkProgress();
    window.addEventListener("grade-progress-updated", checkProgress);
    return () => window.removeEventListener("grade-progress-updated", checkProgress);
  }, [isLoggedIn, initialCompleted]);

  useEffect(() => {
    // The server record is authoritative; the local cache only fills in for a
    // signed-out reader (and keeps the badge instant after an attempt).
    const checkQuiz = async () => {
      const local = readQuizResults();
      setQuizResults(local);
      try {
        const res = await fetch("/api/grade/quiz/results", { cache: "no-store" });
        const data = await res.json();
        if (data.results) setQuizResults(mergeQuizResults(local, data.results as QuizResults));
      } catch {
        // Offline or signed out — the cache above already rendered.
      }
    };
    checkQuiz();
    window.addEventListener(QUIZ_UPDATED_EVENT, checkQuiz);
    return () => window.removeEventListener(QUIZ_UPDATED_EVENT, checkQuiz);
  }, []);

  // The chapter to resume from: first unfinished one the reader can actually open.
  const nextChapter = useMemo(() => {
    for (const g of CURRICULUM) {
      if (!isLoggedIn && g.tier === "prem") continue;
      for (const s of g.secs) {
        if (s.href && !completed.includes(s.href) && !completed.includes(s.n)) return { sec: s, group: g };
      }
    }
    return null;
  }, [completed, isLoggedIn]);

  // Land with the reader's current level already open, until they pick another.
  useEffect(() => {
    if (touchedGroup) return;
    const idx = nextChapter ? CURRICULUM.indexOf(nextChapter.group) : 0;
    setOpenGroup(idx === -1 ? 0 : idx);
  }, [nextChapter, touchedGroup]);

  const percentage = totalChapters > 0 ? Math.round((completed.length / totalChapters) * 100) : 0;

  const passedLevelCount = QUIZ_LEVELS.filter((level) => quizResults[String(level)]?.passed).length;
  const foundationReady = [1, 2, 3, 4].every((level) => quizResults[String(level)]?.passed);

  const toggleGroup = (idx: number) => {
    setTouchedGroup(true);
    setOpenGroup((current) => (current === idx ? null : idx));
  };

  return (
    <>
      {/* Progress strip — replaces the old full-width card */}
      <div className="gc-strip">
        {isLoggedIn ? (
          <>
            <div className="gc-strip-meta">
              <b>{completed.length}/{totalChapters}</b>
              <span>บทที่เรียนจบแล้ว</span>
            </div>
            <div className="gc-bar" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
              <i style={{ width: `${percentage}%` }} />
            </div>
            <span className="gc-pct">{percentage}%</span>
          </>
        ) : (
          <>
            <div className="gc-strip-meta">
              <b>0/{totalChapters}</b>
              <span>เข้าสู่ระบบเพื่อบันทึกความคืบหน้า</span>
            </div>
            <button type="button" className="gc-login" onClick={() => window.dispatchEvent(new CustomEvent("open-login"))}>
              เข้าสู่ระบบ
            </button>
          </>
        )}
      </div>

      {isLoggedIn && passedLevelCount > 0 ? (
        <a className="gc-cert-link" href="/grade/certificate">
          <span className="gc-cert-text">
            <b>ใบรับรอง</b>
            <small>
              ผ่านแบบทดสอบแล้ว {passedLevelCount} ระดับ
              {foundationReady ? " · ออกใบระดับพื้นฐานได้แล้ว" : ""}
            </small>
          </span>
          <span aria-hidden="true">→</span>
        </a>
      ) : null}

      {nextChapter ? (
        <a className="gc-continue" href={nextChapter.sec.href}>
          <span className="gc-continue-label">
            {completed.length > 0 ? "เรียนต่อจากที่ค้าง" : "เริ่มเรียนบทแรก"}
          </span>
          <span className="gc-continue-title">
            <b>{nextChapter.sec.n}</b> {nextChapter.sec.t}
          </span>
          <span className="gc-continue-go" aria-hidden="true">→</span>
        </a>
      ) : null}

      {/* Curriculum — one collapsed row per level, expand to see its chapters */}
      <div className="gc-accordion">
        {CURRICULUM.map((g, idx) => {
          const chapters = g.secs.filter((s) => s.href);
          const done = chapters.filter((s) => s.href && (completed.includes(s.href) || completed.includes(s.n))).length;
          const isOpen = openGroup === idx;
          const locked = !isLoggedIn && g.tier === "prem";
          const quizLevel = idx + 1;
          const quizResult = hasQuiz(quizLevel) ? quizResults[String(quizLevel)] : undefined;

          return (
            <div className={`gc-group ${isOpen ? "open" : ""}`} key={idx}>
              <button
                type="button"
                className="gc-head"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(idx)}
              >
                <span className="gc-head-main">
                  <b>{g.title}</b>
                  <span className="gc-sub">{g.sub}</span>
                  {quizResult?.passed ? <span className="gc-quiz-badge">ผ่านแบบทดสอบ ✓</span> : null}
                </span>
                <span className={`gc-tier ${g.tier}`}>{g.tier === "free" ? "ไม่มีค่าใช้จ่าย" : "Premium"}</span>
                <span className="gc-count">{isLoggedIn ? `${done}/${chapters.length}` : `${g.secs.length} บท`}</span>
                <span className="gc-chevron" aria-hidden="true">▾</span>
              </button>

              {isOpen ? (
                <div className="gc-body">
                  {g.secs.map((s) => {
                    const isDone = !!(s.href && (completed.includes(s.href) || completed.includes(s.n)));
                    if (!s.href) {
                      return (
                        <div className="gc-item is-soon" key={s.n}>
                          <span className="gc-n">{s.n}</span>
                          <span className="gc-t">{s.t}</span>
                          <span className="gc-a">กำลังจัดทำ</span>
                        </div>
                      );
                    }
                    return (
                      <a
                        className={`gc-item ${locked ? "is-locked" : ""} ${isDone ? "is-done" : ""}`}
                        href={locked ? "#" : s.href}
                        key={s.n}
                        onClick={(e) => { if (locked) { e.preventDefault(); setShowPremiumModal(true); } }}
                      >
                        <span className="gc-n">{s.n}</span>
                        <span className="gc-t">
                          {s.t}
                          {s.star ? <span className="gc-star">★</span> : null}
                          {isDone ? <span className="gc-check" aria-label="เรียนจบแล้ว">✓</span> : null}
                        </span>
                        <span className="gc-a" aria-hidden="true">
                          {locked ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                          ) : "→"}
                        </span>
                      </a>
                    );
                  })}

                  {hasQuiz(quizLevel) ? (
                    <a
                      className={`gc-quiz-row ${locked ? "is-locked" : ""}`}
                      href={locked ? "#" : `/grade/checkpoint/${quizLevel}`}
                      onClick={(e) => { if (locked) { e.preventDefault(); setShowPremiumModal(true); } }}
                    >
                      <span className="gc-quiz-icon" aria-hidden="true">?</span>
                      <span className="gc-quiz-text">
                        <b>แบบทดสอบท้ายระดับ</b>
                        <small>
                          {locked
                            ? "เนื้อหา Premium"
                            : quizResult
                              ? `คะแนนสูงสุด ${quizResult.bestPercent}% · ทำไปแล้ว ${quizResult.attempts} ครั้ง`
                              : `${QUIZ_ASK_COUNT} ข้อ · ผ่านที่ ${QUIZ_PASS_PERCENT}% · สุ่มข้อใหม่ทุกครั้ง`}
                        </small>
                      </span>
                      <span className="gc-quiz-go" aria-hidden="true">
                        {locked ? "🔒" : quizResult?.passed ? "✓" : "→"}
                      </span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {showPremiumModal && (
        <div className="gc-modal-backdrop" onClick={() => setShowPremiumModal(false)}>
          <div className="gc-modal" onClick={(e) => e.stopPropagation()}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <h3>เนื้อหา Premium</h3>
            <p>บทเรียนนี้สงวนไว้สำหรับสมาชิก Premium กรุณาเข้าสู่ระบบเพื่อเข้าถึงเนื้อหา</p>
            <div className="gc-modal-actions">
              <button type="button" onClick={() => setShowPremiumModal(false)}>ปิดหน้าต่าง</button>
              <button
                type="button"
                className="primary"
                onClick={() => { setShowPremiumModal(false); window.dispatchEvent(new CustomEvent("open-login")); }}
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
