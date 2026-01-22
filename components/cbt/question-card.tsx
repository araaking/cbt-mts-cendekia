"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/shared/lib/utils";

interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
  image?: string | null;
  options: string[]; // Assume ["Option A", "Option B", ...] or JSON array from DB
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({
  questionNumber,
  questionText,
  image,
  options,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {

  // Helper to get A, B, C, D label
  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is 'A'
  };

  return (
    <Card className="w-full shadow-md border-slate-200">
      <CardContent className="p-6 sm:p-8">
        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full font-bold text-slate-700">
            {questionNumber}
          </div>
          <div className="space-y-4 w-full">
            <div className="prose max-w-none text-slate-800 text-lg">
               {/* Ideally use a markdown parser or HTML renderer here if questionText contains formatting */}
               <p>{questionText}</p>
            </div>
            
            {image && (
                <div className="my-4 rounded-lg overflow-hidden border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`Question ${questionNumber}`} className="max-w-full h-auto object-contain max-h-[400px]" />
                </div>
            )}
          </div>
        </div>

        <div className="pl-12">
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={onAnswer}
            className="space-y-3"
          >
            {options.map((option, index) => {
              const optionKey = getOptionLabel(index); // "A", "B", ...
              return (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-center space-x-3 border rounded-lg p-4 transition-all cursor-pointer hover:bg-slate-50",
                    selectedAnswer === optionKey ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500" : "border-slate-200"
                  )}
                  onClick={() => onAnswer(optionKey)}
                >
                  <RadioGroupItem value={optionKey} id={`option-${index}`} className="text-blue-600" />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer font-normal text-slate-700 text-base flex gap-3 pointer-events-none"
                  >
                    <span className="font-bold text-slate-900 w-5">{optionKey}.</span>
                    <span>{option}</span>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
