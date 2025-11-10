import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export function downloadReportAsPDF(reportData: any) {
  const content = [
    // Header with logo placeholder and title
    {
      columns: [
        {
          width: "*",
          stack: [
            {
              text: reportData.reportName,
              fontSize: 22,
              bold: true,
              color: "#1a1a1a",
              margin: [0, 0, 0, 5],
            },
            {
              text: "Comprehensive Product Analysis",
              fontSize: 11,
              color: "#666666",
              italics: true,
            },
          ],
        },
        {
          width: "auto",
          stack: [
            {
              text: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              fontSize: 10,
              color: "#666666",
              alignment: "right",
            },
          ],
        },
      ],
      margin: [0, 0, 0, 20],
    },

    // Divider line
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 2,
          lineColor: "#007bff",
        },
      ],
      margin: [0, 0, 0, 20],
    },

    // Transparency Score - Card Style
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: "TRANSPARENCY SCORE",
                  fontSize: 11,
                  color: "#666666",
                  alignment: "center",
                  margin: [0, 0, 0, 8],
                  letterSpacing: 1,
                },
                {
                  text: `${reportData.transparencyScore}/10`,
                  fontSize: 32,
                  bold: true,
                  color:
                    reportData.transparencyScore >= 7
                      ? "#28a745"
                      : reportData.transparencyScore >= 5
                      ? "#ffc107"
                      : "#dc3545",
                  alignment: "center",
                },
                {
                  text: getScoreLabel(reportData.transparencyScore),
                  fontSize: 10,
                  color: "#666666",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                  italics: true,
                },
              ],
              fillColor: "#f8f9fa",
              border: [false, false, false, false],
              margin: [20, 15, 20, 15],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 25],
    },

    // Executive Summary Section
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: "EXECUTIVE SUMMARY",
                  fontSize: 13,
                  bold: true,
                  color: "#1a1a1a",
                  margin: [0, 0, 0, 10],
                },
                {
                  text: reportData.reportSummary,
                  fontSize: 10,
                  lineHeight: 1.6,
                  color: "#333333",
                  alignment: "justify",
                },
              ],
              border: [false, false, false, false],
              margin: [15, 15, 15, 15],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        fillColor: "#fff9e6",
      },
      margin: [0, 0, 0, 25],
    },

    // Detailed Report Section Header
    {
      text: "DETAILED ANALYSIS",
      fontSize: 14,
      bold: true,
      color: "#1a1a1a",
      margin: [0, 10, 0, 15],
      decoration: "underline",
      decorationColor: "#007bff",
    },

    // Report Content
    ...parseMarkdownToPdfContent(reportData.report),

    // Footer Section
    {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 1,
          lineColor: "#dddddd",
        },
      ],
      margin: [0, 30, 0, 15],
    },

    // AI Disclaimer
    {
      table: {
        widths: ["*"],
        body: [
          [
            {
              stack: [
                {
                  text: "AI-GENERATED REPORT DISCLAIMER",
                  fontSize: 10,
                  bold: true,
                  color: "#856404",
                  margin: [0, 0, 0, 5],
                },
                {
                  text: "This report has been generated using artificial intelligence based on information provided by the product manufacturer. While every effort has been made to ensure accuracy, this report should be used for informational purposes only. We recommend verifying critical information through independent sources and consulting with qualified professionals before making decisions based on this report. The transparency score is a calculated metric and does not constitute a certification or endorsement.",
                  fontSize: 8,
                  color: "#856404",
                  lineHeight: 1.4,
                  alignment: "justify",
                },
              ],
              fillColor: "#fff3cd",
              border: [false, false, false, false],
              margin: [10, 10, 10, 10],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0,
        vLineWidth: () => 0,
      },
      margin: [0, 0, 0, 15],
    },

    // Generated By Footer
    {
      columns: [
        {
          width: "*",
          text: "Generated by Product Transparency Report Generator",
          fontSize: 9,
          color: "#999999",
          alignment: "left",
        },
      ],
      margin: [0, 5, 0, 0],
    },
  ];

  const docDefinition = {
    content: content,
    defaultStyle: {
      font: "Roboto",
    },
    pageMargins: [40, 40, 40, 40],
    footer: (currentPage: number, pageCount: number) => {
      return {
        columns: [
          {
            text: "© 2025 Product Transparency Report Generator",
            fontSize: 8,
            color: "#999999",
            alignment: "left",
            margin: [40, 0, 0, 0],
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: 8,
            color: "#999999",
            alignment: "right",
            margin: [0, 0, 40, 0],
          },
        ],
        margin: [0, 10, 0, 0],
      };
    },
  };

  //@ts-ignore
  pdfMake.createPdf(docDefinition).download(`${reportData.reportName}.pdf`);
}

// Helper function to get score label
function getScoreLabel(score: number): string {
  if (score >= 9) return "Exceptional Transparency";
  if (score >= 7) return "High Transparency";
  if (score >= 5) return "Moderate Transparency";
  if (score >= 3) return "Low Transparency";
  return "Very Poor Transparency";
}

// Helper function to parse markdown into pdfmake content
function parseMarkdownToPdfContent(markdown: string) {
  const lines = markdown.split("\n");
  const content: any[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      content.push({ text: "", margin: [0, 3, 0, 3] });
      return;
    }

    // H1 Headers
    if (trimmed.startsWith("# ")) {
      content.push({
        text: trimmed.substring(2),
        fontSize: 16,
        bold: true,
        color: "#1a1a1a",
        margin: [0, 15, 0, 8],
      });
      content.push({
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 0,
            lineWidth: 2,
            lineColor: "#007bff",
          },
        ],
        margin: [0, 0, 0, 10],
      });
    }
    // H2 Headers
    else if (trimmed.startsWith("## ")) {
      content.push({
        text: trimmed.substring(3),
        fontSize: 13,
        bold: true,
        color: "#333333",
        margin: [0, 12, 0, 6],
      });
    }
    // H3 Headers
    else if (trimmed.startsWith("### ")) {
      content.push({
        text: trimmed.substring(4),
        fontSize: 11,
        bold: true,
        color: "#555555",
        margin: [0, 10, 0, 5],
      });
    }
    // Bullet points
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const bulletText = trimmed.substring(2);

      // Check if bullet has inline bold
      if (bulletText.includes("**")) {
        content.push({
          text: parseInlineBold(bulletText),
          fontSize: 10,
          color: "#333333",
          margin: [15, 2, 0, 2],
        });
      } else {
        content.push({
          text: bulletText,
          fontSize: 10,
          color: "#333333",
          margin: [15, 2, 0, 2],
          leadingIndent: 10,
        });
      }
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      content.push({
        text: trimmed,
        fontSize: 10,
        color: "#333333",
        margin: [15, 2, 0, 2],
      });
    }
    // Horizontal rule
    else if (trimmed === "---" || trimmed === "***") {
      content.push({
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 1,
            lineColor: "#dddddd",
          },
        ],
        margin: [0, 10, 0, 10],
      });
    }
    // Lines with **bold** text (like **Frame:** description)
    else if (trimmed.includes("**")) {
      content.push({
        text: parseInlineBold(trimmed),
        fontSize: 10,
        color: "#333333",
        lineHeight: 1.5,
        margin: [0, 2, 0, 2],
      });
    }
    // Regular text
    else {
      content.push({
        text: trimmed,
        fontSize: 10,
        color: "#333333",
        lineHeight: 1.5,
        alignment: "justify",
        margin: [0, 2, 0, 2],
      });
    }
  });

  return content;
}

// Helper function to parse inline bold text
function parseInlineBold(text: string): any[] {
  const parts: any[] = [];

  // Split by ** markers
  const segments = text.split("**");

  segments.forEach((segment, index) => {
    if (segment) {
      // Odd indices are bold (between ** markers)
      parts.push({
        text: segment,
        bold: index % 2 === 1,
      });
    }
  });

  return parts;
}
