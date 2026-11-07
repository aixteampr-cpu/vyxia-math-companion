export type ObjectiveQuestion = {
  id: string;
  type: "multiple_choice" | "true_false" | "complete";
  correctAnswer: string;
};

export function gradeObjectiveAnswers(
  questions: ObjectiveQuestion[],
  answers: Record<string, string>,
) {
  const objective = questions.filter((question) => question.type !== "essay");
  const correct = objective.filter((question) => {
    const response = answers[question.id]?.trim().toLocaleLowerCase();
    return response !== undefined && response === question.correctAnswer.trim().toLocaleLowerCase();
  }).length;

  return { correct, total: objective.length };
}