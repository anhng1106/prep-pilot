"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import PromptInput from "./PromptInput";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const SpeechRecognition =
  typeof window !== "undefined" &&
  ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition);

export default function PromptInputWithBottomActions({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // const [prompt, setPrompt] = useState<string>(value);

  // const handlePromptChange = (value: string) => {
  //   setPrompt(value);
  //   onChange(value);
  // };

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      return toast.error("Voice input is not supported in this browser.");
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      toast.success("Listening... Speak now!");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onChange(value + " " + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      switch (event.error) {
        case "no-speech":
          toast.error("No speech detected. Please try again.");
          break;
        case "audio-capture":
          toast.error("Microphone not found or not accessible.");
          break;
        case "not-allowed":
          toast.error(
            "Microphone access denied. Please allow microphone access."
          );
          break;
        case "network":
          toast.error("Network error occurred. Check your connection.");
          break;
        default:
          toast.error(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
    };

    try {
      recognition.start();
    } catch (error) {
      toast.error("Failed to start speech recognition.");
      console.error(error);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <form className="flex w-full flex-col items-start rounded-medium bg-default-100 transition-colors hover:bg-default-200/70">
        <PromptInput
          classNames={{
            inputWrapper: "!bg-transparent shadow-none",
            innerWrapper: "relative",
            input: "pt-1 pl-2 pb-6 !pr-10 text-medium",
          }}
          minRows={3}
          radius="lg"
          value={value}
          onValueChange={onChange}
          variant="flat"
        />
        <div className="flex w-full items-center justify-between gap-2 overflow-scroll px-4 pb-4">
          <div className="flex w-full gap-1 md:gap-3">
            <Button
              size="sm"
              startContent={
                <Icon
                  className="text-default-500"
                  icon="solar:soundwave-linear"
                  width={18}
                />
              }
              variant="flat"
              onPress={handleVoiceInput}
            >
              Type with Voice
            </Button>
          </div>
          <p className="py-1 text-tiny text-default-400">
            Characters:{value.length}
          </p>
        </div>
      </form>
    </div>
  );
}
