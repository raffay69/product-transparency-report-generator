"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { Cedarville_Cursive } from "next/font/google";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const cursive = Cedarville_Cursive({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { isLoaded, isSignedIn } = useAuth();
  return (
    <>
      <div className="absolute right-6 top-6 flex gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="secondary" className="cursor-pointer">
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="secondary" className="cursor-pointer">
              Sign In
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl w-full text-center space-y-12">
          {/* Main heading - simple and direct */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              <div className="relative">
                <div
                  className={`${cursive.className} absolute -rotate-15 -top-8`}
                >
                  Generate
                </div>
                <span>Product </span>
              </div>
              <span className="text-primary">Transparency</span> Report
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Generate comprehensive transparency reports for your products
              through intelligent questioning. Build trust through complete
              clarity.
            </p>
          </div>

          {/* CTA Button - minimal design */}
          <div className="pt-8">
            <Button
              size="lg"
              onClick={() =>
                isLoaded && isSignedIn
                  ? onGetStarted()
                  : toast.error("Please login first", {
                      style: { background: "red" },
                    })
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-lg font-semibold transition-all duration-300"
            >
              Get Started
            </Button>
            <div className="mt-5">
              <Alert>
                <AlertTitle className="text-center flex align-baseline mx-auto text-red-600">
                  <AlertTriangle className="inline mr-2" size={20} />
                  Heads up: Gemini may get rate-limited or overloaded.
                </AlertTitle>
                <AlertDescription className="mx-auto">
                  If questions or the report fail to load, please keep trying .
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
