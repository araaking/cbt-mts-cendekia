"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/cbt/timer";
import { QuestionCard } from "@/components/cbt/question-card";
import { QuestionNav } from "@/components/cbt/question-nav";
import { Loader2, ChevronLeft, ChevronRight, Save, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define Types locally for now
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
  const { testId } = use(params);
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<TestSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
            router.push(`/result/${resultId}`);
            return;
          }
          throw new Error("Gagal memuat sesi ujian");
        }
        const data = await res.json();
        setSession(data);
      } catch {
        toast({ title: "Error", description: "Gagal terhubung ke server.", variant: "destructive" });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [router, toast, testId]); // Added testId to deps

  // Handle Answer
  const handleAnswer = async (answer: string) => {
    if (!session) return;
    const currentQ = session.questions[currentQuestionIndex];

    // Optimistic Update
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));

    // Sync to Server
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
    } catch {
      console.error("Failed to save answer");
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
    } catch {
      toast({ title: "Error", description: "Gagal mengirim jawaban.", variant: "destructive" });
      setIsSubmitting(false);
      setShowConfirmFinish(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-medium">Memuat ujian...</p>
      </div>
    );
  }

  if (!session) return null;

  const currentQuestion = session.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === session.questions.length - 1;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg text-sm tracking-wide">
            CBT
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold text-slate-800 text-sm">Tes Seleksi Masuk</h1>
            <p className="text-xs text-slate-500">Soal {currentQuestionIndex + 1} dari {session.questions.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Timer
              durationMinutes={session.result.test.duration}
              startTime={new Date(session.result.startedAt)}
              onTimeUp={handleFinish}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => setShowConfirmFinish(true)}
          >
            <LogOut className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Selesai</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Question Area (Main) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Mobile Timer Placeholder if needed, or keep sticky header enough */}

          <div className="flex-1">
            <QuestionCard
              questionNumber={currentQuestionIndex + 1}
              questionText={currentQuestion.question}
              image={currentQuestion.image}
              options={currentQuestion.options}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Button>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider">
                <Save className="w-3 h-3" />
                Auto-Saved
              </div>

              <Button
                size="lg"
                onClick={() => isLastQuestion ? setShowConfirmFinish(true) : setCurrentQuestionIndex(prev => prev + 1)}
                className={`${isLastQuestion ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-lg shadow-blue-600/10 min-w-[140px] gap-2`}
              >
                {isLastQuestion ? "Selesai" : "Selanjutnya"}
                {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <QuestionNav
            totalQuestions={session.questions.length}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answers}
            questions={session.questions}
            onSelectQuestion={setCurrentQuestionIndex}
          />
        </div>
      </main>

      {/* Finish Dialog */}
      <Dialog open={showConfirmFinish} onOpenChange={setShowConfirmFinish}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Selesai</DialogTitle>
            <DialogDescription>
              Anda telah menjawab <span className="font-bold text-slate-900">{answeredCount}</span> dari <span className="font-bold text-slate-900">{session.questions.length}</span> soal.
              <br /><br />
              Apakah Anda yakin ingin mengakhiri sesi ujian ini? Jawaban tidak dapat diubah setelah dikirim.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmFinish(false)}>Kembali Mengerjakan</Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white" onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ya, Selesaikan Ujian
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
