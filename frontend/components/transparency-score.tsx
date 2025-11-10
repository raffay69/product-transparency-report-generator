"use client";

interface TransparencyScoreProps {
  score: number;
}

export default function TransparencyScore({ score }: TransparencyScoreProps) {
  const normalizedScore = Math.max(0, Math.min(10, score));
  const percentage = (normalizedScore / 10) * 100;

  const radius = 95;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Light grey background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#d1d5db" // light gray
            strokeWidth="10"
          />

          {/* Black progress circle – starts from bottom */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset || 1}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
            transform="rotate(90 100 100)" // makes fill start from bottom
          />
        </svg>

        {/* Score in the center */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-5xl md:text-6xl font-bold">
            {normalizedScore.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">/10</div>
        </div>
      </div>

      {/* Label */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Transparency Score</h3>
        <p className="text-muted-foreground">
          {normalizedScore >= 8
            ? "Excellent transparency practices"
            : normalizedScore >= 6
            ? "Good transparency level"
            : normalizedScore >= 4
            ? "Moderate transparency"
            : "Needs improvement"}
        </p>
      </div>
    </div>
  );
}
