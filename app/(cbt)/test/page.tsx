import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { testService } from "@/features/test/services/test.service";

export const dynamic = "force-dynamic";

export default async function TestListPage() {
    const tests = await testService.getAvailableTests();

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            <div className="max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daftar Ujian</h1>
                        <p className="text-slate-500">Pilih ujian yang tersedia untuk memulai sesi.</p>
                    </div>
                    <Link href="/">
                        <Button variant="outline" className="border-slate-200 hover:bg-white hover:text-slate-900">
                            Kembali ke Beranda
                        </Button>
                    </Link>
                </div>

                {/* Content */}
                {tests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 text-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <BookOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Belum Ada Ujian</h3>
                        <p className="text-slate-500 max-w-sm mt-1">
                            Saat ini belum ada jadwal ujian yang aktif. Silakan cek kembali nanti atau hubungi panitia.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map((test) => (
                            <Card key={test.id} className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border-slate-200/60 overflow-hidden flex flex-col">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                <CardHeader className="pb-4">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-2 py-0.5 font-medium">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {test.duration} Menit
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {test.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                                        {test.description || "Tidak ada deskripsi tambahan untuk ujian ini."}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 pb-6 px-6">
                                    <Link href={`/register?testId=${test.id}`} className="w-full">
                                        <Button className="w-full bg-slate-900 hover:bg-blue-600 text-white shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 transition-all h-10 rounded-lg group-hover:translate-y-0">
                                            Pilih & Mulai
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
