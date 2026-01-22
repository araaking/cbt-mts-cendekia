"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { QuestionForm } from "@/components/admin/question-form"

type QuestionData = {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  image: string | null
  order: number
}

export default function EditQuestionPage({ params }: { params: Promise<{ testId: string; questionId: string }> }) {
  const { testId, questionId } = use(params)
  const [question, setQuestion] = useState<QuestionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/questions/${questionId}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setQuestion)
      .catch(() => setQuestion(null))
      .finally(() => setIsLoading(false))
  }, [questionId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!question) {
    return <div className="p-6">Soal tidak ditemukan</div>
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
          <h1 className="text-2xl font-bold text-slate-800">Edit Soal</h1>
          <p className="text-slate-500">Edit detail soal pilihan ganda</p>
        </div>
      </div>

      <QuestionForm testId={testId} initialData={question} mode="edit" />
    </div>
  )
}
