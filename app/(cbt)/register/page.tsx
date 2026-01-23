import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles } from "lucide-react";
import { testService } from "@/features/test/services/test.service";
import RegisterForm from "./register-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
    const availableTests = await testService.getAvailableTests();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <div className="w-full max-w-[440px] space-y-8">
                {/* Header Brand */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-4 transition-transform hover:scale-105">
                        <GraduationCap className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">MTS Cendekia</h1>
                    <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Portal Ujian Digital</span>
                    </div>
                </div>

                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white">
                    <div className="px-8 pt-10 pb-2 text-center">
                        <h2 className="text-xl font-bold text-slate-800">Siap untuk Ujian?</h2>
                        <p className="text-slate-400 text-sm mt-1">Isi data dirimu dengan benar ya!</p>
                    </div>
                    
                    <CardContent className="p-8">
                        <Suspense fallback={
                            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                <p className="text-sm font-medium text-slate-400">Menyiapkan lembar ujian...</p>
                            </div>
                        }>
                            <RegisterForm availableTests={availableTests} />
                        </Suspense>
                    </CardContent>
                </Card>

                {/* Navigation Back */}
                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-slate-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>

            <footer className="mt-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} MTS Cendekia Mandiri
            </footer>
        </div>
    )
}