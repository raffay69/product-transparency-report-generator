"use client";

interface Question {
  qno: number;
  lastQues: boolean;
  quesType: "text" | "mcq";
  options?: string[];
  question: string;
}

interface QuestionCardProps {
  question: Question;
  answer: string;
  onAnswerChange: (answer: string) => void;
}

export default function QuestionCard({
  question,
  answer,
  onAnswerChange,
}: QuestionCardProps) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-xl md:text-xl font-semibold text-balance leading-tight text-foreground">
          {question.question}
        </h2>
      </div>

      {/* Answer Input */}
      <div
        className="space-y-4 animate-fade-in-scale"
        style={{ animationDelay: "0.1s" }}
      >
        {question.quesType === "text" ? (
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-5 py-4 bg-card border border-border/60 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 text-base leading-relaxed rounded-2xl"
            rows={5}
          />
        ) : (
          <div className="space-y-3">
            {question.options?.map((option, idx) => (
              <label
                key={idx}
                className="flex items-center p-4 border border-border/60 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-card/40 transition-all duration-200 group animate-fade-in-scale"
                style={{ animationDelay: `${0.15 + idx * 0.05}s` }}
              >
                <input
                  type="radio"
                  name="mcq-option"
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <span className="ml-4 text-foreground font-medium group-hover:text-primary transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
