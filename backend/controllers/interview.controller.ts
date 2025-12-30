import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import Interview, { IQuestion } from "../models/interview.model";
import { evaluateAnswers, generateQuestions } from "../openai/openai";
import { InterviewBody } from "../types/interview.types";
import { getCurrentUser } from "../utils/auth";

const mockQuestions = (numOfQuestions: number) => {
  const questions = [];
  for (let i = 0; i < numOfQuestions; i++) {
    questions.push({
      question: `This is mock question ${i + 1}?`,
      answer: `Mock answer ${i + 1}`,
    });
  }
  return questions;
};

export const createInterview = catchAsyncErrors(async (body: InterviewBody) => {
  await dbConnect();

  const {
    industry,
    type,
    topic,
    role,
    numOfQuestions,
    difficulty,
    duration,
    user,
  } = body;

  const questions = await generateQuestions(
    industry,
    topic,
    type,
    role,
    numOfQuestions,
    duration,
    difficulty
  );
  // const questions = mockQuestions(numOfQuestions);

  const newInterview = await Interview.create({
    industry,
    type,
    topic,
    role,
    numOfQuestions,
    difficulty,
    duration: duration * 60,
    durationLeft: duration * 60,
    questions,
    user,
  });

  return newInterview?._id
    ? { created: true }
    : (() => {
        throw new Error("Interview not created");
      })();
});

export const getInterview = catchAsyncErrors(async (request: Request) => {
  await dbConnect();

  const user = await getCurrentUser(request);

  const interviews = await Interview.find({
    user: user?._id,
  });

  return { interviews };
});

export const getInterviewById = catchAsyncErrors(async (id: string) => {
  await dbConnect();

  const interview = await Interview.findById(id);

  return { interview };
});

export const deleteUserInterview = catchAsyncErrors(
  async (interviewId: string) => {
    await dbConnect();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    await Interview.deleteOne({ _id: interviewId });

    return { deleted: true };
  }
);

export const updateInterviewDetails = catchAsyncErrors(
  async (
    interviewId: string,
    durationLeft: string,
    questionId: string,
    answer: string,
    completed?: boolean
  ) => {
    await dbConnect();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    if (answer) {
      const questionIndex = interview.questions.findIndex(
        (q: IQuestion) => q._id?.toString() === questionId
      );

      if (questionIndex === -1) {
        throw new Error("Question not found in interview");
      }

      const question = interview?.questions[questionIndex];

      let overallScore = 0;
      let clarity = 0;
      let relevance = 0;
      let completeness = 0;
      let suggestions = "No suggestions provided.";

      if (answer !== "skip") {
        ({ overallScore, clarity, relevance, completeness, suggestions } =
          await evaluateAnswers(question.question, answer));
      }

      if (!question?.completed) {
        interview.answerd = (interview.answerd || 0) + 1;
      }

      question.answer = answer;
      question.completed = true;
      question.results = {
        overallScore,
        clarity,
        relevance,
        completeness,
        suggestions,
      };
      interview.durationLeft = Number(durationLeft);
    }

    if (interview?.answerd === interview?.questions.length) {
      interview.status = "completed";
    }

    if (durationLeft === "0") {
      interview.durationLeft = Number(durationLeft);
      interview.status = "completed";
    }

    if (completed) {
      interview.status = "completed";
    }

    await interview.save();

    return { updated: true };
  }
);
