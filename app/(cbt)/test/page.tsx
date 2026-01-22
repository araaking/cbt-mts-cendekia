import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PlayCircle } from "lucide-react";
import { authClient } from "@/shared/lib/auth-client"; // Actually student doesn't need auth, this might be misleading if used for fetching.
// Ideally use server fetching here.
import { testService } from "@/features/test/services/test.service";

export const dynamic = "force-dynamic";

export default async function TestListPage() {
  const tests = await testService.getAvailableTests();

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Daftar Tes Aktif</h1>
                <p className="text-slate-500">Pilih tes yang tersedia untuk mulai mengerjakan.</p>
            </div>
             <Link href="/">
                <Button variant="outline">Kembali ke Home</Button>
            </Link>
        </div>

        {tests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-slate-300">
                <p className="text-slate-500 text-lg">Tidak ada tes yang aktif saat ini.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle className="flex justify-between items-start gap-4">
                        <span className="line-clamp-2">{test.title}</span>
                        <div className="flex items-center gap-1 text-sm font-normal bg-slate-100 px-2 py-1 rounded text-slate-600 shrink-0">
                            <Clock className="w-4 h-4" />
                            {test.duration} mnt
                        </div>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {test.description || "Tidak ada deskripsi tambahan."}
                    </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href={`/register?testId=${test.id}`} className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
                            <PlayCircle className="w-4 h-4" />
                            Pilih Tes Ini
                        </Button>
                    </Link>
                </CardFooter>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
