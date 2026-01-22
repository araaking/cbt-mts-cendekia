"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText, Loader2, ArrowRight } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!result) return <div className="p-10 text-center text-slate-500">Hasil tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-lg shadow-2xl shadow-blue-900/10 border-slate-200 overflow-hidden rounded-2xl">
        <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
        <CardHeader className="text-center pb-2 pt-10">
          <div className="mx-auto bg-green-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6 animate-in zoom-in duration-300">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">Ujian Selesai!</CardTitle>
          <CardDescription className="text-base pt-2">
            Terima kasih <strong className="text-slate-900">{result.studentName}</strong>, jawaban Anda telah berhasil kami simpan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100/50 text-center">
            <p className="text-slate-600 text-sm leading-relaxed">
              Hasil ujian Anda sedang dalam proses penilaian otomatis oleh sistem kami.
              <br />
              Pengumuman kelulusan akan diinformasikan melalui website atau WhatsApp.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl flex justify-between items-center text-sm border border-slate-100 shadow-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Mata Ujian
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{result.test.title}</span>
            </div>

            <div className="bg-white p-4 rounded-xl flex justify-between items-center text-sm border border-slate-100 shadow-sm">
              <span className="text-slate-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Status Data
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Terkirim
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 bg-slate-50/50 p-8 border-t border-slate-100">
          <Link href="/" className="w-full">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10">
              <Home className="w-4 h-4 mr-2" /> Kembali ke Beranda
            </Button>
          </Link>
          <p className="text-[10px] text-center text-slate-400 uppercase tracking-wider font-medium">
            Sistem CBT MTS Cendekia &bull; 2024
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
