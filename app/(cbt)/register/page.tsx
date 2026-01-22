import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { testService } from "@/features/test/services/test.service";
import RegisterForm from "./register-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
    const availableTests = await testService.getAvailableTests();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 p-4 font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="w-full max-w-lg space-y-6">
                {/* Header Brand */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">MTS Cendekia</h1>
                        <p className="text-slate-500 text-sm font-medium">Sistem Seleksi Berbasis Komputer</p>
                    </div>
                </div>

                <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-1 text-center pb-2 bg-white/50">
                        <CardTitle className="text-xl font-bold text-slate-800">Registrasi Peserta</CardTitle>
                        <CardDescription className="text-slate-500">
                            Lengkapi data diri untuk memulai ujian.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                        <Suspense fallback={<div className="text-center py-8 text-slate-400 animate-pulse">Memuat form...</div>}>
                            <RegisterForm availableTests={availableTests} />
                        </Suspense>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors py-2 px-4 rounded-full hover:bg-white/50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            <footer className="fixed bottom-6 text-center text-xs text-slate-400 font-medium">
                &copy; {new Date().getFullYear()} MTS Cendekia. All rights reserved.
            </footer>
        </div>
    )
}
