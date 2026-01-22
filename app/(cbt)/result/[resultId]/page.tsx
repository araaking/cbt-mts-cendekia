"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type ResultData = {
  // score: number; // Hidden
  // correctAnswers: number; // Hidden
  totalQuestions: number;
  timeSpent: number;
  studentName: string;
  test: {
    title: string;
    description: string;
  };
};

export default function ResultPage({ params }: { params: Promise<{ resultId: string }> }) {
  const { resultId } = use(params);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cbt/result/${resultId}`)
      .then((res) => res.json())
      .then(setResult)
      .finally(() => setLoading(false));
  }, [resultId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!result) return <div className="p-10 text-center">Hasil tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Tes Selesai!</CardTitle>
            <CardDescription>
                Terima kasih <strong>{result.studentName}</strong>, jawaban Anda telah berhasil kami terima.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="text-center space-y-2 py-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <p className="text-slate-600">
                    Hasil tes Anda sedang diproses oleh panitia.
                    <br />
                    Silakan tunggu pengumuman selanjutnya.
                </p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center text-sm border">
                    <span className="text-slate-500 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Mata Uji
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[200px]">{result.test.title}</span>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center text-sm border">
                     <span className="text-slate-500 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Status
                    </span>
                    <span className="font-semibold text-green-600">Terkirim</span>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 bg-slate-50/50 p-6 border-t">
            <Link href="/" className="w-full">
                <Button className="w-full" variant="default">
                    <Home className="w-4 h-4 mr-2" /> Kembali ke Halaman Utama
                </Button>
            </Link>
            <p className="text-xs text-center text-slate-400">
                Silakan screenshot halaman ini sebagai bukti telah mengikuti tes.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
