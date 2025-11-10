"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/question-card";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

interface Question {
  qno: number;
  lastQues: boolean;
  quesType: "text" | "mcq";
  options?: string[];
  question: string;
}

interface FormSectionProps {
  onReportGenerated: (
    transparencyScore: number,
    reportSummary: string,
    report: string,
    reportName: string
  ) => void;
  onCancel: () => void;
}

export default function FormSection({
  onReportGenerated,
  onCancel,
}: FormSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>({
    qno: 1,
    lastQues: false,
    quesType: "text",
    question:
      "Briefly describe your product in one or two sentences (including its name if there is one).",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const searchParam = useSearchParams();
  const { getToken } = useAuth();

  // Fetch initial question

  const handleNext = async () => {
    if (!currentQuestion) return;

    // Validate answer
    if (currentAnswer.trim() === "") {
      alert("Please provide an answer before proceeding.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:4000/dynamic-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          chatId: searchParam.get("chatId"),
          qno: currentQuestion.qno,
          question: currentQuestion.question,
          answer: currentAnswer,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch next question");

      const nextQuestion: Question = await response.json();
      setCurrentQuestion(nextQuestion);
      setCurrentAnswer("");
    } catch (error) {
      toast.error(`Error fetching next question please try again`, {
        style: { background: "red" },
      });
      console.error("Error fetching next question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      if (!currentQuestion) return;

      setIsSubmitting(true);
      const response = await fetch(`http://localhost:4000/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          chatId: searchParam.get("chatId"),
          qno: currentQuestion.qno,
          question: currentQuestion.question,
          answer: currentAnswer,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const reportData = await response.json();

      onReportGenerated(
        reportData.transparencyScore,
        reportData.reportSummary,
        reportData.report,
        reportData.reportName
      );
    } catch (error) {
      toast.error("Error generting report , Please try again", {
        style: { background: "red" },
      });
      console.error("Error generating report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Error loading question</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <p className="text-primary uppercase font-extrabold text-sm leading-7 tracking-widest text-center border-0">
            Question {currentQuestion.qno}
          </p>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          answer={currentAnswer}
          onAnswerChange={setCurrentAnswer}
        />

        {/* Action Buttons */}
        <div className="flex justify-between mt-10 gap-3">
          <Button variant="destructive" onClick={onCancel}>
            Cancel
          </Button>
          {currentQuestion.lastQues ? (
            <Button
              size="lg"
              onClick={handleGenerateReport}
              disabled={isSubmitting || currentAnswer.trim() === ""}
            >
              {isSubmitting ? <>Generating...</> : "Generate Report"}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={isSubmitting || currentAnswer.trim() === ""}
            >
              {isSubmitting ? <>Loading...</> : "Next"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
