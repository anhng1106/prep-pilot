import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import Interview from "../models/interview.model";
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

export const evaluateAnswers1 = catchAsyncErrors(async () => {
  await evaluateAnswers(
    "Describe your process for conducting a needs analysis when designing an English course for adult learners, and give a brief example of how that analysis changed one course decision?",
    "My process for conducting a needs analysis when designing an English course for adult learners involves several key steps. First, I gather information about the learners' backgrounds, goals, and proficiency levels through surveys and interviews. Next, I analyze this data to identify common themes and specific needs. Based on this analysis, I tailor the course content, materials, and activities to address those needs effectively. For example, in a previous course, I discovered that many learners were interested in improving their business communication skills. As a result, I incorporated more role-playing activities and case studies related to workplace scenarios, which significantly enhanced learner engagement and outcomes."
  );
});
