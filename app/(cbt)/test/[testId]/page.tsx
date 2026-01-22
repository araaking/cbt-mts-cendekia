"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/cbt/timer";
import { QuestionCard } from "@/components/cbt/question-card";
import { QuestionNav } from "@/components/cbt/question-nav";
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define Types locally for now, usually imported from shared types
type Question = {
  id: string;
  question: string;
  image?: string;
  options: string[];
  order: number;
};

type TestSession = {
  result: {
    id: string;
    status: string;
    startedAt: string;
    test: {
        duration: number;
    }
  };
  questions: Question[];
};

export default function ExamPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params); // Next.js 15+ param unwrapping
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // valid option chars: "A", "B", ...
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  // Load Session
  useEffect(() => {
    const resultId = localStorage.getItem("cbt_session_token");
    if (!resultId) {
      toast({ title: "Sesi tidak ditemukan", description: "Silakan registrasi ulang.", variant: "destructive" });
      router.push(`/register?testId=${testId}`);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/cbt/start?resultId=${resultId}`);
        if (!res.ok) {
            if (res.status === 403) {
                // Already finished
                router.push(`/result/${resultId}`);
                return;
            }
            throw new Error("Gagal memuat sesi ujian");
        }
        const data = await res.json();
        setSession(data);
        
        // Restore local answers if needed, or rely on another API to fetch existing answers if reload
        // Ideally the /start API should return existing answers.
        // For simplicity now, we assume client state needs to be managed or synced.
        // Let's rely on basic local state for now.
        // TODO: Enhancement - Fetch saved answers from server on load.
        
      } catch (error) {
        toast({ title: "Error", description: "Gagal terhubung ke server.", variant: "destructive" });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [router, toast]);

  // Handle Answer
  const handleAnswer = async (answer: string) => {
    if (!session) return;
    const currentQ = session.questions[currentQuestionIndex];
    
    // Optimistic Update
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));

    // Sync to Server (Debounced or immediate)
    // Here doing immediate for simplicity
    try {
        await fetch("/api/cbt/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resultId: session.result.id,
                questionId: currentQ.id,
                selectedAnswer: answer
            })
        });
    } catch (e) {
        console.error("Failed to save answer");
        toast({ title: "Gagal menyimpan", description: "Periksa koneksi internet Anda.", variant: "destructive" });
    }
  };

  const handleFinish = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
        const res = await fetch("/api/cbt/finish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resultId: session.result.id })
        });
        
        if (res.ok) {
            localStorage.removeItem("cbt_session_token");
            router.push(`/result/${session.result.id}`);
        } else {
            throw new Error("Gagal menyelesaikan ujian");
        }
    } catch (error) {
        toast({ title: "Error", description: "Gagal mengirim jawaban.", variant: "destructive" });
        setIsSubmitting(false);
        setShowConfirmFinish(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-slate-500">Memuat soal ujian...</p>
        </div>
    );
  }

  if (!session) return null;

  const currentQuestion = session.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 sticky top-0 z-10 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-4">
             <div className="bg-blue-600 text-white font-bold p-2 rounded">
                 CBT
             </div>
             <div>
                 <h1 className="font-semibold text-slate-800 text-sm md:text-base hidden md:block">Tes Seleksi Masuk</h1>
                 <p className="text-xs text-slate-500">Soal {currentQuestionIndex + 1} / {session.questions.length}</p>
             </div>
         </div>
         
         <div className="flex items-center gap-4">
             <Timer 
                durationMinutes={session.result.test.duration} 
                startTime={new Date(session.result.startedAt)}
                onTimeUp={handleFinish}
             />
             <Button 
                variant={isLastQuestion ? "destructive" : "default"}
                onClick={() => isLastQuestion ? setShowConfirmFinish(true) : setCurrentQuestionIndex(prev => prev + 1)}
             >
                {isLastQuestion ? "Selesai" : "Next"} 
                {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
             </Button>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3 space-y-6">
              <QuestionCard 
                 questionNumber={currentQuestionIndex + 1}
                 questionText={currentQuestion.question}
                 image={currentQuestion.image}
                 options={currentQuestion.options} // Assuming DB stores flat array of strings
                 selectedAnswer={answers[currentQuestion.id]}
                 onAnswer={handleAnswer}
              />
              
              <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
                  </Button>
                  
                  <div className="flex items-center gap-4">
                      {/* Save indicator */}
                      <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                          <Save className="w-4 h-4" />
                          <span>Tersimpan otomatis</span>
                      </div>

                      <Button 
                        variant={isLastQuestion ? "destructive" : "default"}
                        onClick={() => isLastQuestion ? setShowConfirmFinish(true) : setCurrentQuestionIndex(prev => prev + 1)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLastQuestion ? "Selesai" : "Selanjutnya"} 
                        {!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
                      </Button>
                  </div>
              </div>
          </div>

          {/* Sidebar Nav */}
          <div className="hidden lg:block lg:col-span-1">
               <QuestionNav 
                 totalQuestions={session.questions.length}
                 currentQuestionIndex={currentQuestionIndex}
                 answeredQuestions={answers}
                 questions={session.questions}
                 onSelectQuestion={setCurrentQuestionIndex}
               />
          </div>
      </main>
      
      {/* Mobile Nav Drawer could go here */}

      {/* Finish Confirmation Dialog */}
      <Dialog open={showConfirmFinish} onOpenChange={setShowConfirmFinish}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Selesaikan Ujian?</DialogTitle>
            <DialogDescription>
                Anda telah menjawab {answeredCount} dari {session.questions.length} soal.
                Yakin ingin mengakhiri ujian ini? Anda tidak dapat mengubah jawaban setelah ini.
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmFinish(false)}>Batal</Button>
            <Button variant="default" onClick={handleFinish} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Ya, Selesaikan
            </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
