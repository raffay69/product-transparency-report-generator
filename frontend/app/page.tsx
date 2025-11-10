"use client";

import { useState } from "react";
import HeroSection from "@/components/hero-section";
import FormSection from "@/components/form-section";
import ReportSection from "@/components/report-section";
import ReportDetailView from "@/components/report-detail-view";
import ReportsSidebar from "@/components/reports-sidebar";
import { useAuth } from "@clerk/nextjs";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

export default function Page() {
  const [currentPage, setCurrentPage] = useState<
    "hero" | "form" | "report" | "detail"
  >("hero");
  const [reportData, setReportData] = useState<{
    transparencyScore: number;
    reportSummary: string;
    report: string;
    reportName: string;
  } | null>(null);
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    const chatId = nanoid();
    router.push(`/?chatId=${chatId}`);
    setCurrentPage("form");
  };

  const handleReportGenerated = (
    transparencyScore: number,
    reportSummary: string,
    report: string,
    reportName: string
  ) => {
    setReportData({ transparencyScore, reportSummary, report, reportName });
    setCurrentPage("report");
  };

  const handleCreateNew = () => {
    setCurrentPage("hero");
    router.push("/");
    setReportData(null);
  };

  const handleViewReport = (chatId: string) => {
    router.push(`/?chatId=${chatId}`);
    setCurrentPage("detail");
  };

  // Show sidebar on hero and form pages
  const showSidebar = currentPage === "hero" && isLoaded && isSignedIn;

  return (
    <main className="min-h-screen bg-linear-to-br from-background via-secondary/5 to-background flex">
      {showSidebar && <ReportsSidebar onViewReport={handleViewReport} />}

      <div className={showSidebar ? "flex-1" : "w-full"}>
        {currentPage === "hero" && (
          <HeroSection onGetStarted={handleGetStarted} />
        )}
        {currentPage === "form" && (
          <FormSection
            onReportGenerated={handleReportGenerated}
            onCancel={handleCreateNew}
          />
        )}
        {currentPage === "report" && reportData && (
          <ReportSection
            score={reportData.transparencyScore}
            reportName={reportData.reportName}
            report={reportData.report}
            reportSummary={reportData.reportSummary}
            onCreateNew={handleCreateNew}
          />
        )}
        {currentPage === "detail" && (
          <ReportDetailView onBack={handleCreateNew} />
        )}
      </div>
    </main>
  );
}
