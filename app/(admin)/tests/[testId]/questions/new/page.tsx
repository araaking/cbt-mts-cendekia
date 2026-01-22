"use client"

import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { QuestionForm } from "@/components/admin/question-form"

export default function NewQuestionPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)

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

      <QuestionForm testId={testId} mode="create" />
    </div>
  )
}
