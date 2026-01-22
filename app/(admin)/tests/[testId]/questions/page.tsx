"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Question = {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  order: number
}

type Test = {
  id: string
  title: string
  isActive: boolean
  results: { id: string }[]
}

export default function QuestionsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const { toast } = useToast()

  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/tests/${testId}`).then((r) => r.json()),
      fetch(`/api/admin/questions?testId=${testId}`).then((r) => r.json()),
    ])
      .then(([testData, questionsData]) => {
        setTest(testData)
        setQuestions(questionsData)
      })
      .finally(() => setIsLoading(false))
  }, [testId])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/questions/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setQuestions(questions.filter((q) => q.id !== deleteId))
      toast({ title: "Berhasil", description: "Soal berhasil dihapus" })
    } catch {
      toast({ title: "Error", description: "Gagal menghapus soal", variant: "destructive" })
    } finally {
      setDeleteId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  const canEdit = test && !test.isActive && test.results.length === 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/tests/${testId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Kelola Soal</h1>
            <p className="text-slate-500">{test?.title}</p>
          </div>
        </div>
        {canEdit && (
          <Link href={`/tests/${testId}/questions/new`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Soal
            </Button>
          </Link>
        )}
      </div>

      {!canEdit && (
        <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg">
          Soal tidak dapat diedit karena tes sedang aktif atau sudah ada peserta.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Soal ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Belum ada soal. Klik &quot;Tambah Soal&quot; untuk memulai.
            </div>
          ) : (
            <div className="space-y-4">
              {questions
                .sort((a, b) => a.order - b.order)
                .map((q, idx) => (
                  <div key={q.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <GripVertical className="h-5 w-5" />
                        <span className="font-bold text-lg">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-3">{q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, i) => {
                            const label = String.fromCharCode(65 + i)
                            const isCorrect = label === q.correctAnswer
                            return (
                              <div
                                key={i}
                                className={`px-3 py-2 rounded text-sm ${
                                  isCorrect ? "bg-green-100 text-green-800 font-medium" : "bg-slate-50 text-slate-600"
                                }`}
                              >
                                <span className="font-bold mr-2">{label}.</span>
                                {opt}
                                {isCorrect && <Badge variant="success" className="ml-2">Benar</Badge>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/tests/${testId}/questions/${q.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => setDeleteId(q.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Soal?</DialogTitle>
            <DialogDescription>Tindakan ini tidak dapat dibatalkan.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
