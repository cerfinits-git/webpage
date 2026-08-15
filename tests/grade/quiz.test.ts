import assert from "node:assert/strict";
import test from "node:test";
import {
  QUIZZES,
  drawQuestions,
  getQuiz,
  isCorrect,
  isPremiumQuiz,
  gradeAttempt,
  toPublicQuestion,
} from "../../lib/grade/quiz.ts";
import { QUIZ_ASK_COUNT, QUIZ_LEVELS, QUIZ_PASS_PERCENT } from "../../lib/grade/quiz-public.ts";

test("every level asks 12 questions from a bank with room to rotate", () => {
  for (const quiz of QUIZZES) {
    assert.equal(quiz.askCount, 12, `level ${quiz.level} askCount`);
    assert.ok(
      quiz.bank.length > quiz.askCount,
      `level ${quiz.level} bank (${quiz.bank.length}) must exceed askCount so retakes redraw`,
    );
  }
});

test("all eight levels have a quiz", () => {
  for (let level = 1; level <= 8; level += 1) {
    assert.ok(getQuiz(level), `missing quiz for level ${level}`);
  }
});

test("question ids are unique across the whole bank", () => {
  const ids = QUIZZES.flatMap((quiz) => quiz.bank.map((q) => q.id));
  assert.equal(new Set(ids).size, ids.length, "duplicate question id");
});

test("every stored answer is graded as correct by the grader", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      assert.ok(
        isCorrect(question, question.answer as number),
        `${question.id} does not grade its own answer as correct`,
      );
    }
  }
});

test("choice answers point at a real option and options are distinct", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      if (question.type !== "choice") continue;
      assert.ok(
        question.answer >= 0 && question.answer < question.choices.length,
        `${question.id} answer index out of range`,
      );
      assert.equal(
        new Set(question.choices).size,
        question.choices.length,
        `${question.id} has duplicate choices`,
      );
      assert.ok(question.choices.length >= 3, `${question.id} needs at least 3 choices`);
    }
  }
});

test("numeric tolerances are tight enough to reject a wrong answer", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      if (question.type !== "numeric") continue;
      assert.ok(question.tolerance > 0, `${question.id} tolerance must be positive`);
      assert.equal(
        isCorrect(question, question.answer + question.tolerance * 10),
        false,
        `${question.id} tolerance accepts a clearly wrong answer`,
      );
    }
  }
});

test("unanswered questions never count as correct", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      assert.equal(isCorrect(question, null), false, `${question.id} counts null as correct`);
    }
  }
});

test("every question explains itself and links back to a chapter", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      assert.ok(question.explain.length > 40, `${question.id} explanation too thin`);
      assert.ok(question.ref.startsWith("/"), `${question.id} ref is not a path`);
    }
  }
});

test("a draw returns the asked count with no repeats", () => {
  for (const quiz of QUIZZES) {
    const drawn = drawQuestions(quiz);
    assert.equal(drawn.length, quiz.askCount, `level ${quiz.level} draw size`);
    assert.equal(
      new Set(drawn.map((q) => q.id)).size,
      drawn.length,
      `level ${quiz.level} draw repeated a question`,
    );
    for (const question of drawn) {
      assert.ok(quiz.bank.includes(question), `level ${quiz.level} drew a foreign question`);
    }
  }
});

test("repeated draws actually vary, so retaking is not the same paper", () => {
  const quiz = QUIZZES[0];
  const signatures = new Set<string>();
  for (let i = 0; i < 25; i += 1) {
    signatures.add(
      drawQuestions(quiz)
        .map((q) => q.id)
        .sort()
        .join(","),
    );
  }
  assert.ok(signatures.size > 1, "draws never varied across 25 attempts");
});

test("levels 5-8 are gated and 1-4 stay open", () => {
  for (const level of [1, 2, 3, 4]) assert.equal(isPremiumQuiz(level), false, `level ${level}`);
  for (const level of [5, 6, 7, 8]) assert.equal(isPremiumQuiz(level), true, `level ${level}`);
});

test("the client-side quiz constants stay in step with the actual bank", () => {
  assert.deepEqual([...QUIZ_LEVELS], QUIZZES.map((quiz) => quiz.level));
  for (const quiz of QUIZZES) {
    assert.equal(quiz.askCount, QUIZ_ASK_COUNT, `level ${quiz.level} askCount`);
    assert.equal(quiz.passPercent, QUIZ_PASS_PERCENT, `level ${quiz.level} passPercent`);
  }
});

test("a public question carries no answer, tolerance, or explanation", () => {
  for (const quiz of QUIZZES) {
    for (const question of quiz.bank) {
      const published = toPublicQuestion(question) as Record<string, unknown>;
      assert.ok(!("answer" in published), `${question.id} leaked answer`);
      assert.ok(!("tolerance" in published), `${question.id} leaked tolerance`);
      assert.ok(!("explain" in published), `${question.id} leaked explanation`);
      assert.ok(!("ref" in published), `${question.id} leaked ref`);
    }
  }
});

test("grading scores an attempt and reports the pass threshold", () => {
  const quiz = getQuiz(1)!;
  const asked = quiz.bank.slice(0, quiz.askCount);
  const allRight = Object.fromEntries(asked.map((q) => [q.id, q.answer]));

  const perfect = gradeAttempt(1, asked.map((q) => q.id), allRight);
  assert.equal(perfect.ok, true);
  assert.equal(perfect.percent, 100);
  assert.equal(perfect.passed, true);

  const blank = gradeAttempt(1, asked.map((q) => q.id), {});
  assert.equal(blank.ok, true);
  assert.equal(blank.percent, 0);
  assert.equal(blank.passed, false);
});

test("grading refuses a short attempt — one known answer must not score 100%", () => {
  const quiz = getQuiz(1)!;
  const single = quiz.bank[0];
  const outcome = gradeAttempt(1, [single.id], { [single.id]: single.answer });
  assert.equal(outcome.ok, false, "a 1-question submission was accepted");
});

test("grading refuses padded, repeated, or foreign question ids", () => {
  const quiz = getQuiz(1)!;
  const asked = quiz.bank.slice(0, quiz.askCount);
  const repeated = [asked[0].id, ...asked.slice(0, quiz.askCount - 1).map((q) => q.id)];
  assert.equal(gradeAttempt(1, repeated, {}).ok, false, "duplicate ids were accepted");

  const foreign = [...asked.slice(1).map((q) => q.id), getQuiz(2)!.bank[0].id];
  assert.equal(gradeAttempt(1, foreign, {}).ok, false, "a question from another level was accepted");
});
