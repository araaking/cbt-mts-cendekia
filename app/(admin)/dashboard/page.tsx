import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, ClipboardList, TrendingUp } from "lucide-react"
import { testService } from "@/features/test/services/test.service"
import { userService } from "@/features/user/services/user.service"
import { resultService } from "@/features/result/services/result.service"
import { Prisma, User } from "@prisma/client"

export const dynamic = "force-dynamic"

type TestWithStats = Prisma.TestGetPayload<{
  include: {
    questions: { select: { id: true } }
    results: { select: { id: true } }
  }
}>

type ResultWithTestTitle = Prisma.ResultGetPayload<{
  include: {
    test: { select: { title: true } }
  }
}>

export default async function DashboardPage() {
  const [tests, users, results] = await Promise.all([
    testService.getAllTests(true),
    userService.getAllUsers(),
    resultService.getAllResults(),
  ]) as [TestWithStats[], User[], ResultWithTestTitle[]]

  const activeTests = tests.filter((t) => t.isActive).length
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0

  const stats = [
    { label: "Total Tes", value: tests.length, icon: FileText, color: "text-blue-600 bg-blue-100" },
    { label: "Tes Aktif", value: activeTests, icon: TrendingUp, color: "text-green-600 bg-green-100" },
    { label: "Total Peserta", value: results.length, icon: ClipboardList, color: "text-orange-600 bg-orange-100" },
    { label: "Total User", value: users.length, icon: Users, color: "text-purple-600 bg-purple-100" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Selamat datang di Admin Panel CBT MTS Cendekia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rata-rata Skor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600">{avgScore}</div>
            <p className="text-slate-500 mt-2">dari {results.length} peserta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peserta Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-slate-500">Belum ada peserta</p>
            ) : (
              <ul className="space-y-3">
                {results.slice(0, 5).map((r) => (
                  <li key={r.id} className="flex justify-between items-center">
                    <span className="font-medium">{r.studentName}</span>
                    <span className="text-slate-500">Skor: {r.score}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
