"use client";

import { Button } from "@/components/ui/button";
import TransparencyScore from "@/components/transparency-score";
import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { downloadReportAsPDF } from "@/lib/pdfDownloader";
import { toast } from "sonner";

interface ReportDetailViewProps {
  onBack: () => void;
}

interface Details {
  reportName: string;
  transparencyScore: number;
  createdAt: any;
  reportSummary: string;
  report: string;
  quesAndAns: [{ qno: number; question: string; answer: string }];
}

export default function ReportDetailView({ onBack }: ReportDetailViewProps) {
  const [report, setReport] = useState<Details>();
  const [loading, setLoading] = useState(true);
  const searchParam = useSearchParams();
  const { getToken } = useAuth();
  const chatId = searchParam.get("chatId");

  useEffect(() => {
    if (!chatId) return;
    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/recent/${chatId}`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        if (!res.ok) throw new Error("Error fetching data");
        const data = await res.json();
        setReport(data);
        setLoading(false);
      } catch (e) {
        toast.error("Error Fetching Report", { style: { background: "red" } });
      }
    }
    fetchDetails();
  }, [chatId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-border">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <h1 className="text-4xl font-bold text-foreground">
              {report?.reportName}
            </h1>
            <p className="text-muted-foreground mt-2">
              Generated on{" "}
              {new Date(report?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Transparency Score */}
        <div className="flex justify-center py-8">
          <TransparencyScore score={report?.transparencyScore!} />
        </div>

        {/* Questions & Answers */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            Questions & Answers
          </h2>
          <div className="space-y-4">
            {report?.quesAndAns.map(({ qno, question, answer }) => (
              <div
                key={qno}
                className="bg-card border border-border rounded-lg p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                    Question {qno}
                  </span>
                </div>
                <div className="text-black text-xl">{question}</div>
                <p className="text-stone-500 leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            Report Summary
          </h3>
          <p className="text-foreground leading-relaxed">
            {report?.reportSummary}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 pb-4">
          <Button
            size="lg"
            onClick={() => downloadReportAsPDF(report)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </Button>
          <Button
            size="lg"
            onClick={onBack}
            variant="outline"
            className="border-border text-foreground hover:bg-card px-8 bg-transparent"
          >
            Create New Report
          </Button>
        </div>
      </div>
    </div>
  );
}
