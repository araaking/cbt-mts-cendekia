"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, Save, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

// Tipe data untuk soal hasil parsing
type ParsedQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  originalText: string;
};

export default function ImportPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const { toast } = useToast();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [step, setStep] = useState<"upload" | "preview">("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/import/docx", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memproses file");

      const data = await res.json();
      parseHtmlToQuestions(data.html);
      setStep("preview");
    } catch {
      toast({
        title: "Error",
        description: "Gagal memproses file DOCX",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Fungsi sederhana untuk memecah HTML menjadi soal
  // Ini adalah logika "Smart Parsing" versi 2.0 (Improved)
  const parseHtmlToQuestions = (html: string) => {
    // Buat elemen temporary untuk parsing HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // Style fix for images
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '10px 0';
    });

    // Ambil semua paragraf
    const paragraphs = Array.from(doc.body.children);
    
    const questions: ParsedQuestion[] = [];
    let currentQuestion: Partial<ParsedQuestion> = { options: [] };
    let questionCounter = 1;

    // Regex Patterns
    // 1. Deteksi Nomor Soal: "1.", "1)", "10." (di awal paragraf)
    const questionNumberPattern = /^\s*\d+[\.\)]\s+/;
    
    // 2. Deteksi Opsi: "A.", "a)", "(A)", "A " (dengan titik/kurung)
    const optionPattern = /^\s*[\(]?[A-Ea-e][\.\)][\s\t]+/;

    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || "";
      const htmlContent = p.outerHTML; // Simpan HTML agar gambar terbawa

      // Abaikan paragraf kosong tapi simpan jika ada gambar
      if (!text && !p.querySelector("img")) return;

      const isQuestionNumber = questionNumberPattern.test(text);
      const isOption = optionPattern.test(text);

      // LOGIKA 1: Jika ketemu nomor soal (1., 2., dst), PASTI soal baru
      if (isQuestionNumber) {
        // Simpan soal sebelumnya jika ada isinya
        if (currentQuestion.question) {
            questions.push({
                id: questionCounter++,
                question: currentQuestion.question,
                options: currentQuestion.options || [],
                correctAnswer: "",
                originalText: "",
            });
            currentQuestion = { options: [] };
        }

        // Mulai soal baru
        // Opsional: Hapus nomor soal dari teks agar bersih (misal "1. Apa..." jadi "Apa...")
        // Tapi karena ini HTML, agak tricky menghapus text node pertama saja.
        // Kita biarkan saja nomornya agar sesuai dokumen asli.
        currentQuestion.question = htmlContent;
        return; // Lanjut ke paragraf berikutnya
      }

      // LOGIKA 2: Jika ketemu pola opsi (A., B., dst)
      if (isOption) {
        // Bersihkan prefix opsi untuk disimpan bersih (opsional, tapi bagus untuk UI)
        // Kita simpan utuh saja dulu atau bersihkan sedikit
        // const cleanOption = htmlContent.replace(optionPattern, "").trim(); 
        // Mengubah HTML agak riskan merusak tag, jadi simpan utuh htmlContent
        // Tapi UI kita sudah ada bullet A/B/C, jadi idealnya kita bersihkan prefix A. B. nya dari teks
        
        // Cara aman clean prefix dari HTML string:
        // Kita replace text content pattern di awal string
        let cleanHtml = htmlContent;
        // Regex replace di string HTML mentah agak bahaya kalau kena tag, 
        // tapi pola A. biasanya di awal text node.
        // Kita coba replace pattern jika match di awal (di luar tag).
        // Simplifikasi: Simpan apa adanya, user bisa edit nanti, atau biarkan double A. A. (di UI ada A, di teks ada A)
        
        // Coba bersihkan teksnya saja untuk display yang lebih rapi
        // const tempDiv = document.createElement('div');
        // tempDiv.innerHTML = htmlContent;
        // if(tempDiv.textContent) {
        //     tempDiv.textContent = tempDiv.textContent.replace(optionPattern, "");
        //     cleanHtml = tempDiv.innerHTML;
        // }
        // Note: Code di atas jalan di browser (client side), jadi aman.
        
        // Implementasi pembersihan prefix opsi:
        // Hacky way to replace content but keep tags (like images in option? unlikely but possible)
        // Let's just strip the pattern from the HTML string loosely
        // cleanHtml = htmlContent.replace(optionPattern, ""); // This might fail if pattern matches inside tag attributes? Unlikely.
        
        // Better: Just push the HTML content. The UI renders "A" separately.
        // If the text contains "A. Ayam", and UI shows "A", user sees "A   A. Ayam".
        // Let's try to remove it.
        const match = text.match(optionPattern);
        if (match) {
            // Hapus string match dari htmlContent
            // Hati-hati replace global atau salah target.
            // Kita replace hanya occurrence pertama
            cleanHtml = htmlContent.replace(match[0], "").trim();
            
            // Fix: kadang replace meninggalkan tag p kosong atau rusak
            if (cleanHtml.startsWith("<p>")) {
                 cleanHtml = cleanHtml.replace("<p>", "<p>").trim(); // no-op
            }
        }

        currentQuestion.options?.push(cleanHtml);
        return;
      }

      // LOGIKA 3: Bukan Nomor Soal, Bukan Opsi
      // Ini bisa jadi:
      // a. Lanjutan teks soal (baris ke-2 dst)
      // b. Lanjutan teks opsi (baris ke-2 opsi)
      // c. Soal baru yang TIDAK bernomor (kasus file berantakan)
      
      // Heuristic:
      // Jika kita sudah punya opsi, maka ini kemungkinan besar adalah soal baru yang tidak bernomor
      // ATAU lanjutan opsi terakhir.
      // Jika opsi > 0, dan paragraf ini panjang... asumsikan soal baru?
      // TAPI user bilang "jadi 1 file malah soal 1", artinya semua ter-merge.
      // Jadi kita harus lebih agresif memisah.
      
      // Jika sudah ada opsi (A,B,C,D) lalu ketemu teks bebas -> Kemungkinan besar soal baru (lupa nomor)
      if ((currentQuestion.options?.length || 0) >= 2) { // Minimal 2 opsi
          // Anggap ini soal baru (Implicit Split)
          if (currentQuestion.question) {
            questions.push({
                id: questionCounter++,
                question: currentQuestion.question,
                options: currentQuestion.options || [],
                correctAnswer: "",
                originalText: "",
            });
            currentQuestion = { options: [] };
          }
          currentQuestion.question = htmlContent;
      } else {
          // Belum ada opsi, atau opsi masih sedikit (1?)
          // -> Append ke elemen terakhir yang aktif
          if ((currentQuestion.options?.length || 0) > 0) {
              // Append ke opsi terakhir
              const lastIdx = currentQuestion.options!.length - 1;
              currentQuestion.options![lastIdx] += `<br/>${htmlContent}`;
          } else {
              // Append ke soal
              if (currentQuestion.question) {
                  currentQuestion.question += `<br/>${htmlContent}`;
              } else {
                  currentQuestion.question = htmlContent;
              }
          }
      }
    });

    // Push soal terakhir
    if (currentQuestion.question) {
      questions.push({
        id: questionCounter++,
        question: currentQuestion.question,
        options: currentQuestion.options || [],
        correctAnswer: "",
        originalText: "",
      });
    }

    setParsedQuestions(questions);
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
        const res = await fetch(`/api/admin/tests/${testId}/questions/bulk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions: parsedQuestions }),
        });

        if (!res.ok) throw new Error("Gagal menyimpan soal");

        toast({
            title: "Berhasil",
            description: `${parsedQuestions.length} soal berhasil disimpan!`,
        });
        router.push(`/admin/tests/${testId}`);
    } catch {
        toast({
            title: "Error",
            description: "Gagal menyimpan soal ke database",
            variant: "destructive",
        });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
            &larr; Kembali
        </Button>
        <h1 className="text-2xl font-bold">Import Soal dari Word</h1>
      </div>

      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload File DOCX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:bg-slate-50 transition-colors">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-600 mb-2">
                Drag & drop file DOCX di sini, atau klik untuk memilih file
              </p>
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200 inline-block text-left">
                <strong>Tips Format Word:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Gunakan penomoran (1., 2., dst) untuk setiap soal.</li>
                    <li>Gunakan huruf (A., B., C., D.) untuk setiap opsi.</li>
                    <li>Gambar bisa disisipkan langsung di dalam dokumen.</li>
                </ul>
                <div className="mt-3 pt-2 border-t border-slate-200">
                    <a 
                        href="/api/admin/import/template" 
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
                    >
                        <Download className="h-3 w-3" />
                        Download Template DOCX
                    </a>
                </div>
              </div>
              <Input
                type="file"
                accept=".docx"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Pilih File
                </label>
              </Button>
              {file && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              )}
            </div>

            <Button
              onClick={processFile}
              disabled={!file || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Proses & Preview"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="sticky top-4 z-10 bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Preview Soal</p>
                <p className="text-xs text-slate-500">
                  {parsedQuestions.filter(q => q.correctAnswer).length} dari {parsedQuestions.length} soal siap disimpan
                </p>
              </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("upload")}>
                    Ulangi Upload
                </Button>
                <Button 
                    onClick={handleSave} 
                    disabled={isProcessing || parsedQuestions.some(q => !q.correctAnswer)}
                    className={parsedQuestions.some(q => !q.correctAnswer) ? "opacity-50 cursor-not-allowed" : ""}
                >
                    {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4" />}
                    Simpan Semua Soal
                </Button>
            </div>
          </div>

          <div className="space-y-4">
            {parsedQuestions.map((q, idx) => (
              <Card key={q.id} className={`transition-all ${!q.correctAnswer ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">
                            #{idx + 1}
                        </span>
                        {!q.correctAnswer && (
                            <span className="text-xs text-orange-600 font-medium flex items-center gap-1 animate-pulse">
                                <AlertCircle className="h-3 w-3" />
                                Pilih Kunci Jawaban
                            </span>
                        )}
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        onClick={() => {
                            setParsedQuestions(parsedQuestions.filter(item => item.id !== q.id));
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none mb-6 p-4 bg-white rounded-lg border border-slate-100"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                        const optionLabel = String.fromCharCode(65 + optIdx);
                        const isSelected = q.correctAnswer === optionLabel;
                        
                        return (
                            <div 
                                key={optIdx} 
                                className={`
                                    relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected 
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                    }
                                `}
                                onClick={() => {
                                    const newQuestions = [...parsedQuestions];
                                    newQuestions[idx].correctAnswer = optionLabel;
                                    setParsedQuestions(newQuestions);
                                }}
                            >
                                <div className={`
                                    flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border
                                    ${isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-slate-500 border-slate-300'
                                    }
                                `}>
                                    {optionLabel}
                                </div>
                                <div className="text-sm pt-0.5 w-full" dangerouslySetInnerHTML={{ __html: opt }} />
                            </div>
                        );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {parsedQuestions.length === 0 && (
             <div className="text-center py-12 text-slate-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Tidak ada soal yang ditemukan.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
