"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewTestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: parseInt(formData.get("duration") as string),
      isActive: false,
    }

    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error("Gagal membuat tes")

      const test = await res.json()
      toast({ title: "Berhasil", description: "Tes berhasil dibuat" })
      router.push(`/tests/${test.id}/questions`)
    } catch {
      toast({ title: "Error", description: "Gagal membuat tes", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/tests">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Buat Tes Baru</h1>
          <p className="text-slate-500">Isi informasi dasar tes</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Tes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Tes</Label>
              <Input id="title" name="title" placeholder="Contoh: Tes Masuk MTS Cendekia 2026" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea id="description" name="description" placeholder="Deskripsi singkat tentang tes ini" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durasi (menit)</Label>
              <Input id="duration" name="duration" type="number" min="1" defaultValue="60" required />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Simpan & Lanjut ke Soal
              </Button>
              <Link href="/tests">
                <Button type="button" variant="outline">Batal</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
