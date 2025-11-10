"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TransparencyScore from "@/components/transparency-score";
import { downloadReportAsPDF } from "@/lib/pdfDownloader";

interface ReportSectionProps {
  score: number;
  reportName: string;
  report: string;
  reportSummary: string;
  onCreateNew: () => void;
}

export default function ReportSection({
  score,
  report,
  reportName,
  reportSummary,
  onCreateNew,
}: ReportSectionProps) {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl space-y-12">
        {/* Success Message */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4"></div>
          <h1 className="text-4xl font-bold">Report Generation Complete</h1>
          <p className="text-lg text-muted-foreground">
            Your product transparency report has been successfully generated.
          </p>
        </div>

        {/* Transparency Score */}
        <TransparencyScore score={score} />

        {/* Report Details */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-4">
          <h2 className="text-xl font-semibold">Report Summary</h2>
          <p className="text-foreground leading-relaxed">{reportSummary}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() =>
              downloadReportAsPDF({
                reportName,
                report,
                reportSummary,
                transparencyScore: score,
              })
            }
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Download Report
            <span className="ml-2">↓</span>
          </Button>
          <Button
            size="lg"
            onClick={onCreateNew}
            variant="outline"
            className="border-border text-foreground hover:bg-card px-8 bg-transparent"
          >
            Create New Report
            <span className="ml-2">+</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
