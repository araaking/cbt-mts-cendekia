"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Record<string, string>; // map of questionId -> answer
  questions: { id: string }[];
  onSelectQuestion: (index: number) => void;
}

export function QuestionNav({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  questions,
  onSelectQuestion,
}: QuestionNavProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b bg-slate-50">
        <h3 className="font-semibold text-slate-800">Navigasi Soal</h3>
        <p className="text-xs text-slate-500 mt-1">
          {Object.keys(answeredQuestions).length} dari {totalQuestions} terjawab
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {questions.map((q, index) => {
            const isAnswered = !!answeredQuestions[q.id];
            const isCurrent = currentQuestionIndex === index;

            return (
              <Button
                key={q.id}
                variant="outline"
                size="sm"
                onClick={() => onSelectQuestion(index)}
                className={cn(
                  "h-10 w-full relative transition-all",
                  isCurrent
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                    : isAnswered
                    ? "bg-slate-800 text-white hover:bg-slate-700 border-transparent"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {index + 1}
                {isAnswered && !isCurrent && (
                  <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-green-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-slate-50 text-xs space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
            <span className="text-slate-600">Terjawab</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-blue-500 bg-blue-50 rounded-sm"></div>
            <span className="text-slate-600">Sedang dibuka</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-slate-200 bg-white rounded-sm"></div>
            <span className="text-slate-600">Belum dijawab</span>
        </div>
      </div>
    </div>
  );
}
