"use client";
import { useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";

export default function PaddleProvider() {
  useEffect(() => {
    initializePaddle({
      environment:
        process.env.NODE_ENV === "production" ? "production" : "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_TOKEN as string,
    });
  }, []);

  return null;
}
