"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QuestionFormData = {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  image: string | null;
};

interface QuestionFormProps {
  testId: string;
  initialData?: QuestionFormData;
  mode: "create" | "edit";
}

export function QuestionForm({ testId, initialData, mode }: QuestionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<QuestionFormData>(
    initialData || {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "A",
      image: null,
    }
  );

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload/image", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData({ ...formData, image: data.url });
      toast({ title: "Berhasil", description: "Gambar berhasil diupload" });
    } catch {
      toast({ 
        title: "Error", 
        description: "Gagal mengupload gambar", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent, addMore: boolean = false) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      testId,
      ...formData,
    };

    try {
      const url = mode === "create" 
        ? "/api/admin/questions" 
        : `/api/admin/questions/${initialData?.id}`;
      
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast({ 
        title: "Berhasil", 
        description: `Soal berhasil ${mode === "create" ? "ditambahkan" : "diupdate"}` 
      });

      if (addMore) {
        setFormData({
            question: "",
            options: ["", "", "", ""],
            correctAnswer: "A",
            image: null,
        });
        // Scroll to top
        window.scrollTo(0, 0);
      } else {
        router.push(`/tests/${testId}/questions`);
        router.refresh();
      }
    } catch {
      toast({ 
        title: "Error", 
        description: `Gagal ${mode === "create" ? "menambahkan" : "mengupdate"} soal`, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Detail Soal Baru" : "Edit Soal"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan</Label>
            <Textarea 
              id="question" 
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Tulis pertanyaan di sini..." 
              rows={3} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Gambar (Opsional)</Label>
            
            {formData.image ? (
              <div className="relative border rounded-lg p-2 bg-slate-50 w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="max-h-48 rounded object-contain" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => setFormData({ ...formData, image: null })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById("image-upload")?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload Gambar
                </Button>
                <Input 
                   placeholder="Atau paste URL gambar..." 
                   value={formData.image || ""}
                   onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                   className="flex-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Pilihan Jawaban</Label>
            {["A", "B", "C", "D"].map((label, idx) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-bold w-6">{label}.</span>
                <Input 
                  value={formData.options[idx]}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Pilihan ${label}`}
                  required
                  className={formData.correctAnswer === label ? "border-green-500 ring-1 ring-green-500" : ""}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === label}
                    onChange={() => setFormData({ ...formData, correctAnswer: label })}
                    className="w-4 h-4 text-blue-600"
                    id={`correct-${label}`}
                  />
                  <Label htmlFor={`correct-${label}`} className="cursor-pointer text-sm text-slate-600">
                    Benar
                  </Label>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
            >
                Batal
            </Button>
            {mode === "create" && (
              <Button 
                type="button" 
                variant="secondary" 
                disabled={isLoading || isUploading}
                onClick={(e) => handleSubmit(e, true)}
              >
                Simpan & Tambah Lagi
              </Button>
            )}
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Soal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
