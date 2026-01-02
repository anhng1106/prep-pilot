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

export const calculateAverageScore = (questions: IQuestion[]) => {
  if (!questions || questions.length === 0) {
    return 0;
  }

  const totalScore = questions.reduce(
    (sum, question) => sum + (question?.result?.overallScore || 0),
    0
  );

  return (totalScore / questions.length).toFixed(1);
};

export const calculateDuration = (duration: number, durationLeft: number) => {
  const durationUsedInMinutes = ((duration - durationLeft) / 60).toFixed(0);
  const totalDurationInMinutes = (duration / 60).toFixed(0);

  return {
    total: parseInt(totalDurationInMinutes),
    strValue: `${durationUsedInMinutes} / ${totalDurationInMinutes} mins`,
    chartDataValue: parseFloat(durationUsedInMinutes),
  };
};
