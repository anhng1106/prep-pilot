import { IQuestion } from "@/backend/models/interview.model";

export const saveAnswerToLocalStorage = (
  interviewId: string,
  questionId: string,
  answer: string
) => {
  const key = `interview-${interviewId}-answers`;

  const storedAnswers = localStorage.getItem(key);
  const answers = storedAnswers ? JSON.parse(storedAnswers) : {};

  answers[questionId] = answer;

  localStorage.setItem(key, JSON.stringify(answers));
};

export const getAnswerFromLocalStorage = (
  interviewId: string,
  questionId: string
) => {
  const key = `interview-${interviewId}-answers`;

  const storedAnswers = localStorage.getItem(key);
  const answers = storedAnswers ? JSON.parse(storedAnswers) : {};

  return answers[questionId] || "";
};

export const getAllAnswersFromLocalStorage = (interviewId: string) => {
  const key = `interview-${interviewId}-answers`;

  const storedAnswers = localStorage.getItem(key);
  const answers = storedAnswers ? JSON.parse(storedAnswers) : null;

  return answers;
};

export const getFirstIncompleteQuestionIndex = (questions: IQuestion[]) => {
  if (!questions || questions.length === 0) {
    return 0;
  }

  const firstIncompleteIndex = questions.findIndex(
    (question) => !question.completed
  );

  return firstIncompleteIndex !== -1 ? firstIncompleteIndex : 0;
};
