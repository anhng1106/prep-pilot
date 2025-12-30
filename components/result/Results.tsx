"use client";

import { evaluateUserAnswers } from "@/actions/interview.action";
import { Button } from "@heroui/button";
import React from "react";

const Results = () => {
  const handleClick = () => {
    evaluateUserAnswers();
  };
  return (
    <div>
      <Button onPress={handleClick}>Evaluate</Button>
    </div>
  );
};

export default Results;
