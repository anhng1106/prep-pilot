"use client";

import React, { useEffect, useState } from "react";
import { Progress, Button, Alert, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview.model";
import { getFirstIncompleteQuestionIndex } from "@/helpers/interview";
import { formatTime } from "@/helpers/helper";
import PromptInputWithBottomActions from "./PromptInputWithBottomActions.tsx";
import { set } from "mongoose";
import { toast } from "react-hot-toast";
import { updateInterview } from "@/actions/interview.action.js";

export default function Interview({ interview }: { interview: IInterview }) {
  const initialQuestionIndex = getFirstIncompleteQuestionIndex(
    interview?.questions
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(initialQuestionIndex);

  const [answer, setAnswer] = useState("");

  const [timeLeft, setTimeLeft] = useState(interview?.durationLeft);
  const [showTimeAlert, setShowTimeAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = interview?.questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }

        if (prevTime === 10) {
          setShowTimeAlert(true);
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const saveAnswerToDb = async (questionId: string, answer: string) => {
    setLoading(true);

    try {
      const res = await updateInterview(
        interview?._id?.toString(),
        timeLeft?.toString(),
        questionId,
        answer
      );

      if (res?.error) {
        setLoading(false);
        return toast.error("Failed to save answer. Please try again.");
      }

      toast.success("Answer saved successfully!");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full max-w-full flex-col gap-8">
      {showTimeAlert && (
        <Alert
          color="danger"
          description={"Interview is about to exit"}
          title={"Time up!"}
        />
      )}

      <Progress
        aria-label="Interview Progress"
        className="w-full"
        color="default"
        label={`Question 1 of 10`}
        size="md"
        value={4}
      />
      <div className="flex flex-wrap gap-1.5">
        <Chip
          color={"success"}
          size="sm"
          variant="flat"
          className="font-bold cursor-pointer text-sm radius-full"
        >
          1
        </Chip>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <span className="text-lg font-semibold text-right mb-2 sm:mb-0">
          Duration Left: {formatTime(timeLeft)}
        </span>
        <Button
          color="danger"
          startContent={<Icon icon="solar:exit-outline" fontSize={18} />}
          variant="solid"
        >
          Save & Exit Interview
        </Button>
      </div>

      <span className="text-center">
        <span
          className={`tracking-tight inline font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#FF1CF7] to-[#b249f8] text-[1.4rem] lg:text-2.5xl flex items-center justify-center h-full`}
        >
          {currentQuestion?.question}
        </span>
      </span>

      <PromptInputWithBottomActions
        key={currentQuestionIndex}
        value={answer}
        onChange={handleAnswerChange}
      />

      <div className="flex justify-between items-center mt-5">
        <Button
          className="bg-foreground px-[18px] py-2 font-medium text-background"
          radius="full"
          color="secondary"
          variant="flat"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:arrow-left-linear"
              width={20}
            />
          }
        >
          Previous
        </Button>

        <Button
          className="px-[28px] py-2"
          radius="full"
          variant="flat"
          color="success"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:compass-big-bold"
              width={18}
            />
          }
        >
          Skip the question
        </Button>

        <Button
          className="bg-foreground px-[18px] py-2 font-medium text-background"
          radius="full"
          color="secondary"
          variant="flat"
          endContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-[2]"
              icon="solar:arrow-right-linear"
              width={20}
            />
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
