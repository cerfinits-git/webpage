// Client-safe half of the checkpoint quiz.
//
// The question bank in `quiz.ts` carries the answer keys, so it must never be
// imported from a client component — doing so ships every answer in the browser
// bundle, where anyone can read them straight out of the page source. This
// module holds the shapes and the browser-side cache instead: no answers, no
// explanations, nothing that gives a question away before it is submitted.

export type PublicChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  setup?: string;
  choices: string[];
};

export type PublicNumericQuestion = {
  id: string;
  type: "numeric";
  prompt: string;
  setup?: string;
  unit?: string;
};

/** A question as the browser sees it before grading — stripped of its answer. */
export type PublicQuizQuestion = PublicChoiceQuestion | PublicNumericQuestion;

/** Quiz header details that are safe to render before an attempt is graded. */
export type QuizMeta = {
  level: number;
  title: string;
  intro: string;
  askCount: number;
  passPercent: number;
};

/** Feedback for one question, released only after the server grades it. */
export type GradedQuestion = {
  id: string;
  correct: boolean;
  /** Index into `choices` for a choice question, or the value for a numeric one. */
  answer: number;
  explain: string;
  ref: string;
};

export type QuizSubmitResult = {
  percent: number;
  correctCount: number;
  total: number;
  passed: boolean;
  graded: GradedQuestion[];
  /** False when the attempt was graded but not recorded (e.g. not signed in). */
  saved: boolean;
};

export type QuizResult = { bestPercent: number; passed: boolean; attempts: number };
export type QuizResults = Record<string, QuizResult>;

export const QUIZ_STORAGE_KEY = "cerfinits_grade_quiz";
export const QUIZ_UPDATED_EVENT = "grade-quiz-updated";

/**
 * Levels that have a checkpoint quiz. Listing them reveals nothing, and it lets
 * the curriculum render quiz badges without importing the bank. A test asserts
 * this stays in step with QUIZZES.
 */
export const QUIZ_LEVELS: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Uniform across every level, so the curriculum can describe a quiz without
 * loading the bank. Tests assert the banks still agree with these.
 */
export const QUIZ_ASK_COUNT = 12;
export const QUIZ_PASS_PERCENT = 80;

export function hasQuiz(level: number): boolean {
  return QUIZ_LEVELS.includes(level);
}

/**
 * Local cache of results, kept so a signed-out reader still sees their progress
 * within the session. It is a convenience only — certificates read the
 * server-side record, because anything in localStorage can simply be typed in.
 */
export function readQuizResults(): QuizResults {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) || "{}") as QuizResults;
  } catch {
    return {};
  }
}

export function cacheQuizResult(level: number, percent: number, passed: boolean) {
  if (typeof window === "undefined") return;
  const all = readQuizResults();
  const key = String(level);
  const previous = all[key];
  all[key] = {
    bestPercent: Math.max(percent, previous?.bestPercent ?? 0),
    passed: passed || (previous?.passed ?? false),
    attempts: (previous?.attempts ?? 0) + 1,
  };
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent(QUIZ_UPDATED_EVENT));
}

/** Merge the authoritative server results over the local cache. */
export function mergeQuizResults(local: QuizResults, server: QuizResults): QuizResults {
  const merged: QuizResults = { ...local };
  for (const [level, result] of Object.entries(server)) {
    const cached = merged[level];
    merged[level] = cached
      ? {
          bestPercent: Math.max(cached.bestPercent, result.bestPercent),
          passed: cached.passed || result.passed,
          attempts: Math.max(cached.attempts, result.attempts),
        }
      : result;
  }
  return merged;
}
