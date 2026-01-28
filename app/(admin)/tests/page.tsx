import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Clock, Eye, Pencil } from "lucide-react"
import { testService } from "@/features/test/services/test.service"

export const dynamic = "force-dynamic"

type TestItem = {
  id: string
  title: string
  duration: number
  isActive: boolean
  questions: { id: string }[]
  results: { id: string }[]
}

export default async function TestsPage() {
  const tests = await testService.getAllTests(true) as TestItem[]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Tes</h1>
          <p className="text-slate-500">Buat dan kelola tes untuk siswa</p>
        </div>
        <Link href="/tests/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Tes Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tes</CardTitle>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Belum ada tes. Klik tombol &quot;Buat Tes Baru&quot; untuk memulai.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Soal</TableHead>
                  <TableHead>Peserta</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="h-4 w-4" />
                        {test.duration} menit
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={test.isActive ? "success" : "secondary"}>
                        {test.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.questions?.length || 0} soal</TableCell>
                    <TableCell>{test.results?.length || 0} peserta</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/tests/${test.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                      </Link>
                      <Link href={`/tests/${test.id}/questions`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Pencil className="h-4 w-4" />
                          Soal
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
