"use client";

import React, { useEffect, useState } from "react";
import { Progress, Button, Alert, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview, IQuestion } from "@/backend/models/interview.model";
import {
  getAllAnswersFromLocalStorage,
  getAnswerFromLocalStorage,
  getFirstIncompleteQuestionIndex,
  saveAnswerToLocalStorage,
} from "@/helpers/interview";
import { formatTime } from "@/helpers/helper";
import PromptInputWithBottomActions from "./PromptInputWithBottomActions.tsx";
import { toast } from "react-hot-toast";
import { updateInterview } from "@/actions/interview.action";
import { useRouter } from "next/navigation.js";
import { time } from "console";

export default function Interview({ interview }: { interview: IInterview }) {
  const router = useRouter();
  const initialQuestionIndex = getFirstIncompleteQuestionIndex(
    interview?.questions
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(initialQuestionIndex);

  const [answer, setAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState<{ [key: string]: string }>({});

  const [timeLeft, setTimeLeft] = useState(interview?.durationLeft);
  const [showTimeAlert, setShowTimeAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = interview?.questions[currentQuestionIndex];

  //if interview id changes, reset states -> answer changed
  useEffect(() => {
    //load saved answers from localStorage
    const storedAnswers = getAllAnswersFromLocalStorage(
      interview?._id?.toString()
    );

    if (storedAnswers) {
      setAllAnswers(storedAnswers);
    } else {
      interview?.questions?.forEach((question: IQuestion) => {
        if (question?.completed) {
          saveAnswerToLocalStorage(
            interview?._id.toString(),
            question._id.toString(),
            question?.answer || ""
          );
        }
      });
    }
  }, [interview?._id, interview?.questions]);

  //load answer for the current question
  useEffect(() => {
    const savedAnswer = getAnswerFromLocalStorage(
      interview?._id.toString(),
      currentQuestion?._id.toString()
    );
    setAnswer(savedAnswer || "");
  }, [currentQuestionIndex, currentQuestion?._id, interview?._id]);

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
        return toast.error(
          res?.error?.message || "Failed to save answer. Please try again."
        );
      }

      toast.success("Answer saved successfully!");
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async (answer: string) => {
    const previousAnswer = allAnswers[currentQuestion._id.toString()] || "";

    //save if user changed the answer
    if (previousAnswer !== answer && answer.trim() !== "") {
      await saveAnswerToDb(currentQuestion._id.toString(), answer);

      saveAnswerToLocalStorage(
        interview?._id.toString(),
        currentQuestion._id.toString(),
        answer
      );

      setAllAnswers((prevAnswers) => {
        const newAnswers = { ...prevAnswers };
        newAnswers[currentQuestion?._id.toString()] = answer;

        return newAnswers;
      });
    }

    //move to next question regardless of save answer
    if (currentQuestionIndex < interview.numOfQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        // const nextQuestion = interview.questions[newIndex];
        // setAnswer(
        //   getAnswerFromLocalStorage(
        //     interview?._id.toString(),
        //     nextQuestion._id.toString()
        //   ) || ""
        // );
        return newIndex;
      });
    } else if (currentQuestionIndex === interview.numOfQuestions - 1) {
      //move to 1st question
      setCurrentQuestionIndex(0);
      // setAnswer(
      //   getAnswerFromLocalStorage(
      //     interview?._id.toString(),
      //     interview?.questions[0]?._id.toString()
      //   ) || ""
      // );
    } else {
      setAnswer("");
    }
  };

  const handleSkipQuestion = async () => {
    await handleNextQuestion("skip");
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        // const previousQuestion = interview.questions[newIndex];
        // setAnswer(
        //   getAnswerFromLocalStorage(
        //     interview?._id.toString(),
        //     previousQuestion._id.toString()
        //   )
        // );
        return newIndex;
      });
    }
  };

  const exitedRef = React.useRef(false);

  const handleExitInterview = React.useCallback(async () => {
    if (exitedRef.current) return; // prevent double-call
    exitedRef.current = true;

    setLoading(true);

    try {
      const res = await updateInterview(
        interview?._id?.toString(),
        timeLeft?.toString(),
        currentQuestion?._id?.toString(),
        answer,
        true
      );

      if (res?.error) {
        exitedRef.current = false; // allow retry if it failed
        toast.error(res?.error?.message || "Failed to exit interview.");
        return;
      }

      toast.success("Your interview has been saved and exited.");
      router.push("/app/interviews");
    } catch (error) {
      exitedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [answer, currentQuestion?._id, interview?._id, router, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleExitInterview();
    }
  }, [timeLeft, handleExitInterview]);

  return (
    <div
      suppressHydrationWarning
      className="flex h-full w-full max-w-full flex-col gap-8"
    >
      {showTimeAlert && (
        <Alert
          color="danger"
          description={"Interview is about to exit"}
          title={"Time up!"}
        />
      )}

      <Progress
        aria-label="Interview Progress"
        classNames={{
          track: "drop-shadow-md border border-default",
          indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
          label: "tracking-wider font-medium text-default-600",
          value: "text-foreground/60",
        }}
        // color="default"
        label={`Question ${currentQuestionIndex + 1} of ${
          interview?.numOfQuestions
        }`}
        size="md"
        value={((currentQuestionIndex + 1) / interview?.numOfQuestions) * 100}
      />
      <div className="flex flex-wrap gap-1.5">
        {interview?.questions?.map((question: IQuestion, index: number) => (
          <Chip
            key={question._id.toString()}
            color={allAnswers[question._id.toString()] ? "success" : "default"}
            size="sm"
            variant="flat"
            className="font-bold cursor-pointer text-sm radius-full"
            onClick={() => {
              setCurrentQuestionIndex(index);
              // setAnswer(
              //   getAnswerFromLocalStorage(
              //     interview?._id.toString(),
              //     question._id.toString()
              //   ) || ""
              // );
            }}
          >
            {index + 1}
          </Chip>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
        <span className="text-lg font-semibold text-right mb-2 sm:mb-0">
          Duration Left: {formatTime(timeLeft)}
        </span>
        <Button
          color="danger"
          startContent={<Icon icon="solar:exit-outline" fontSize={18} />}
          variant="solid"
          onPress={handleExitInterview}
          isDisabled={loading}
          isLoading={loading}
        >
          Save & Exit Interview
        </Button>
      </div>

      <span className="text-center h-40">
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
          onPress={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0 || loading}
          isLoading={loading}
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
          onPress={() => handleSkipQuestion()}
          isDisabled={loading}
          isLoading={loading}
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
          onPress={() => handleNextQuestion(answer)}
          isDisabled={loading}
          isLoading={loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
