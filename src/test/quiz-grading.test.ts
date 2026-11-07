import { describe, expect, it } from "vitest";

import { gradeObjectiveAnswers } from "@/lib/quiz-grading";

describe("objective quiz scoring", () => {
  it("checks true/false, multiple-choice, and completion answers without AI grading", () => {
    const questions = [
      { id: "q1", type: "true_false" as const, correctAnswer: "True" },
      { id: "q2", type: "multiple_choice" as const, correctAnswer: "B" },
      { id: "q3", type: "complete" as const, correctAnswer: "12" },
    ];

    expect(gradeObjectiveAnswers(questions, { q1: "true", q2: "b", q3: " 12 " })).toEqual({
      correct: 3,
      total: 3,
    });
    expect(gradeObjectiveAnswers(questions, { q1: "false", q2: "A", q3: "" })).toEqual({
      correct: 0,
      total: 3,
    });
  });
});