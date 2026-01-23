import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { resultService } from "@/features/result/services/result.service"

export const dynamic = "force-dynamic"

const statusMap = {
  IN_PROGRESS: { label: "Sedang Mengerjakan", variant: "warning" as const },
  FINISHED: { label: "Selesai", variant: "success" as const },
  TIMED_OUT: { label: "Waktu Habis", variant: "destructive" as const },
}

export default async function ResultsPage() {
  const results = await resultService.getAllResults()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hasil Tes</h1>
        <p className="text-slate-500">Lihat semua hasil tes peserta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Hasil ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Belum ada hasil tes.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>NISN</TableHead>
                  <TableHead>Tes</TableHead>
                  <TableHead>Skor</TableHead>
                  <TableHead>Benar</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r: any) => {
                  const status = statusMap[r.status as keyof typeof statusMap]
                  const minutes = Math.floor(r.timeSpent / 60)
                  const seconds = r.timeSpent % 60
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.studentName}</TableCell>
                      <TableCell>{r.studentNISN || "-"}</TableCell>
                      <TableCell>{r.test?.title || "-"}</TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">{r.score}</span>
                      </TableCell>
                      <TableCell>
                        {r.correctAnswers}/{r.totalQuestions}
                      </TableCell>
                      <TableCell>
                        {minutes}m {seconds}s
                      </TableCell>
                      <TableCell>
                        <Badge variant={status?.variant}>{status?.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(r.startedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
