"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Divide, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

interface Report {
  chatId: string;
  reportName: string;
}

interface ReportsSidebarProps {
  onViewReport: (chatId: string) => void;
}

export default function ReportsSidebar({ onViewReport }: ReportsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<String | null>(null);
  const { getToken } = useAuth();

  async function fetchRecents() {
    try {
      setLoading(true);
      const res = await fetch(
        "https://product-transparency-report-generator.onrender.com/recents",
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error fetching Recents");
      const data = await res.json();
      setAllReports(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Error fetching recents", { style: { background: "red" } });
    }
  }

  useEffect(() => {
    fetchRecents();
  }, [isOpen]);

  async function handleDelete(chatId: String) {
    try {
      setIsDeletingId(chatId);
      const res = await fetch(
        `https://product-transparency-report-generator.onrender.com/recent/${chatId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error deleting");
      toast.success("Report Deleted Successfully", {
        style: { background: "green" },
      });
      fetchRecents();
    } catch (e) {
      toast.error("Error Deleting Report", { style: { background: "red" } });
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-screen sticky top-0 transition-all duration-300 ${
          isOpen ? "w-80" : "w-20"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            {isOpen && (
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-foreground truncate">
                  Reports
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Your transparency reports
                </p>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform ${
                  isOpen ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto">
          {isOpen && (
            <div className="p-4 space-y-2">
              {loading && allReports.length === 0 ? <div>Loading....</div> : ""}
              {!loading && allReports.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No reports yet. Create your first one!
                </p>
              ) : (
                allReports.map((report) => (
                  <button
                    key={report.chatId}
                    className="w-full flex gap-3 md:text-sm text-left p-4 rounded-lg bg-background/50 hover:bg-background transition-colors duration-200 border border-border/50 hover:border-border group"
                  >
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => onViewReport(report.chatId)}
                    >
                      <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {report.reportName}
                      </p>
                    </div>

                    <div>
                      {isDeletingId === report.chatId ? (
                        <svg
                          className="animate-spin h-5 w-5 text-red-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <Trash2
                          size={20}
                          onClick={() => handleDelete(report.chatId)}
                          className="hover:text-red-400 text-red-600 cursor-pointer"
                        />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {isOpen && (
            <p className="text-xs text-muted-foreground text-center">
              {allReports.length === 0
                ? "Your reports will appear here"
                : `${allReports.length} report${
                    allReports.length !== 1 ? "s" : ""
                  }`}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
