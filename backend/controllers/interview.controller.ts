import dbConnect from "../config/dbConnect";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors";
import Interview from "../models/interview.model";
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

  const questions = mockQuestions(numOfQuestions);

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
