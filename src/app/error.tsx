"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center px-5">
        <h1 className="text-[14px] font-bold uppercase tracking-wide mb-6">
          Something went wrong
        </h1>
        <p className="text-[19px] leading-[32px] mb-8 max-w-[500px]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="text-[15px] uppercase tracking-wide border border-white px-8 py-3 hover:bg-white hover:text-black transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
