"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Save, Power, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Test = {
  id: string
  title: string
  description: string | null
  duration: number
  isActive: boolean
  questions: { id: string }[]
  results: { id: string }[]
}

export default function TestDetailPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const [test, setTest] = useState<Test | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/tests/${testId}`)
      .then((res) => res.json())
      .then(setTest)
      .finally(() => setIsLoading(false))
  }, [testId])

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!test) return
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      duration: parseInt(formData.get("duration") as string),
    }

    try {
      const res = await fetch(`/api/admin/tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast({ title: "Berhasil", description: "Tes berhasil diupdate" })
    } catch {
      toast({ title: "Error", description: "Gagal mengupdate tes", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const toggleActive = async () => {
    if (!test) return
    try {
      const res = await fetch(`/api/admin/tests/${testId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !test.isActive }),
      })
      if (!res.ok) throw new Error()
      setTest({ ...test, isActive: !test.isActive })
      toast({ title: "Berhasil", description: `Tes ${!test.isActive ? "diaktifkan" : "dinonaktifkan"}` })
    } catch {
      toast({ title: "Error", description: "Gagal mengubah status", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/admin/tests/${testId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast({ title: "Berhasil", description: "Tes berhasil dihapus" })
      router.push("/tests")
    } catch {
      toast({ title: "Error", description: "Gagal menghapus tes", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!test) return <div className="p-6">Tes tidak ditemukan</div>

  const hasResults = test.results.length > 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tests">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{test.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={test.isActive ? "success" : "secondary"}>
                {test.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
              <span className="text-slate-500">{test.questions.length} soal</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tests/${testId}/import`}>Import Soal (Word)</Link>
          </Button>
          <Button
            variant={test.isActive ? "destructive" : "default"}
            onClick={toggleActive}
          >
            <Power className="mr-2 h-4 w-4" />
            {test.isActive ? "Nonaktifkan" : "Aktifkan"}
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={hasResults}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Informasi Tes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Tes</Label>
                <Input id="title" name="title" defaultValue={test.title} required disabled={hasResults} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" defaultValue={test.description || ""} rows={3} disabled={hasResults} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (menit)</Label>
                <Input id="duration" name="duration" type="number" defaultValue={test.duration} required disabled={hasResults} />
              </div>
              {hasResults && (
                <p className="text-sm text-orange-600">Tes tidak dapat diedit karena sudah ada peserta.</p>
              )}
              <Button type="submit" disabled={isSaving || hasResults} className="gap-2">
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Total Soal</p>
              <p className="text-2xl font-bold">{test.questions.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Peserta</p>
              <p className="text-2xl font-bold">{test.results.length}</p>
            </div>
            <Link href={`/tests/${testId}/questions`}>
              <Button className="w-full">Kelola Soal</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Tes?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua soal dalam tes ini juga akan dihapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
