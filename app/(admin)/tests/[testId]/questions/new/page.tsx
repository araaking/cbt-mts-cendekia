"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewQuestionPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState("A")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const options = [
      formData.get("optionA") as string,
      formData.get("optionB") as string,
      formData.get("optionC") as string,
      formData.get("optionD") as string,
    ]

    const data = {
      testId,
      question: formData.get("question") as string,
      options,
      correctAnswer,
      image: formData.get("image") || null,
    }

    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()
      toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" })

      const addMore = formData.get("addMore")
      if (addMore) {
        e.currentTarget.reset()
        setCorrectAnswer("A")
      } else {
        router.push(`/tests/${testId}/questions`)
      }
    } catch {
      toast({ title: "Error", description: "Gagal menambahkan soal", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/tests/${testId}/questions`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tambah Soal Baru</h1>
          <p className="text-slate-500">Isi detail soal pilihan ganda</p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Detail Soal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Pertanyaan</Label>
              <Textarea id="question" name="question" placeholder="Tulis pertanyaan di sini..." rows={3} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL Gambar (Opsional)</Label>
              <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
            </div>

            <div className="space-y-4">
              <Label>Pilihan Jawaban</Label>
              {["A", "B", "C", "D"].map((label) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="font-bold w-6">{label}.</span>
                  <Input name={`option${label}`} placeholder={`Pilihan ${label}`} required className="flex-1" />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Jawaban Benar</Label>
              <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((opt) => (
                    <SelectItem key={opt} value={opt}>Opsi {opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan Soal
              </Button>
              <Button type="submit" name="addMore" value="true" variant="outline" disabled={isLoading} className="gap-2">
                <Plus className="h-4 w-4" />
                Simpan & Tambah Lagi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
