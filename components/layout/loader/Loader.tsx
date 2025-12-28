"use client";

import { Spinner } from "@heroui/react";
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
      <Spinner color="default" size="lg" label="Loading..." />
    </div>
  );
};

export default Loader;
