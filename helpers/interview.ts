import { IQuestion } from "@/backend/models/interview.model";

export const getFirstIncompleteQuestionIndex = (questions: IQuestion[]) => {
  if (!questions || questions.length === 0) {
    return 0;
  }

  const firstIncompleteIndex = questions.findIndex(
    (question) => !question.completed
  );

  return firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
};
