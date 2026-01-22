import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { testService } from "@/features/test/services/test.service";
import RegisterForm from "./register-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
    const availableTests = await testService.getAvailableTests();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="mb-8 flex flex-col items-center gap-2">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-600/20">
                    <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-800">MTS Cendekia</h1>
            </div>

            <Card className="w-full max-w-md shadow-xl border-slate-100">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Data Diri Siswa</CardTitle>
                    <CardDescription>
                        Isi form di bawah ini untuk memulai tes seleksi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-center p-4">Memuat form...</div>}>
                        <RegisterForm availableTests={availableTests} />
                    </Suspense>
                </CardContent>
                <CardFooter className="flex justify-center border-t bg-slate-50/50 p-4 rounded-b-xl">
                    <Link href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                        &larr; Kembali ke Halaman Utama
                    </Link>
                </CardFooter>
            </Card>

            <p className="mt-8 text-center text-sm text-slate-400">
                &copy; 2026 MTS Cendekia. Sistem CBT Terintegrasi.
            </p>
        </div>
    )
}
