import type React from "react";
import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {
  Oxanium,
  Source_Code_Pro,
  Source_Serif_4,
  Geist_Mono as V0_Font_Geist_Mono,
} from "next/font/google";
import { Toaster } from "sonner";

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const oxanium = Oxanium({ subsets: ["latin"], weight: ["400", "700"] });
const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Product Transparency Report",
  description:
    "Generate detailed product transparency reports with intelligent follow-up questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
