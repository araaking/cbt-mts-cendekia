"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, UserCircle2, Fingerprint, BookOpen, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Test = {
    id: string;
    title: string;
};

export default function RegisterForm({ availableTests }: { availableTests: Test[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const urlTestId = searchParams.get("testId");
    const [selectedTestId, setSelectedTestId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (urlTestId) {
            const isValid = availableTests.some(t => t.id === urlTestId);
            if (isValid) {
                setSelectedTestId(urlTestId);
            }
        } else if (availableTests.length === 1) {
            setSelectedTestId(availableTests[0].id);
        }
    }, [urlTestId, availableTests]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedTestId) {
            toast({
                title: "Pilih Ujian",
                description: "Jangan lupa pilih mata ujiannya ya!",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const nisn = formData.get("nisn") as string;

        try {
            const res = await fetch("/api/cbt/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testId: selectedTestId,
                    studentData: { name, nisn }
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal registrasi");
            }

            const data = await res.json();
            localStorage.setItem("cbt_session_token", data.id);

            toast({
                title: "Berhasil Terdaftar!",
                description: "Tunggu sebentar, soal sedang disiapkan...",
            });

            router.push(`/test/${selectedTestId}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Gagal registrasi";
            toast({
                title: "Waduh, ada masalah",
                description: message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
                {/* Input Nama */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-[13px] font-bold text-slate-500 ml-1 uppercase tracking-wider">
                        Nama Lengkap
                    </Label>
                    <div className="relative group">
                        <Input
                            id="name"
                            name="name"
                            placeholder="Ketik nama lengkapmu..."
                            required
                            className="h-14 pl-12 rounded-[1.25rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:bg-white transition-all text-base"
                        />
                        <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                </div>

                {/* Input NISN */}
                <div className="space-y-2">
                    <Label htmlFor="nisn" className="flex justify-between items-center text-[13px] font-bold text-slate-500 ml-1 uppercase tracking-wider">
                        NISN
                        <span className="text-[10px] text-slate-300 font-normal normal-case italic">Boleh dikosongkan</span>
                    </Label>
                    <div className="relative group">
                        <Input
                            id="nisn"
                            name="nisn"
                            placeholder="Ketik nomor NISN (jika ada)"
                            type="number"
                            className="h-14 pl-12 rounded-[1.25rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:bg-white transition-all text-base"
                        />
                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                </div>

                {/* Select Ujian */}
                <div className="space-y-2">
                    <Label htmlFor="test" className="text-[13px] font-bold text-slate-500 ml-1 uppercase tracking-wider">
                        Pilih Mata Ujian
                    </Label>
                    <div className="relative group">
                        <Select
                            value={selectedTestId}
                            onValueChange={setSelectedTestId}
                        >
                            <SelectTrigger id="test" className="h-14 pl-12 rounded-[1.25rem] bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-base text-left">
                                <SelectValue placeholder="Pilih yang ingin diuji..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                {availableTests.length > 0 ? (
                                    availableTests.map((test) => (
                                        <SelectItem key={test.id} value={test.id} className="h-12 rounded-xl focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer transition-colors">
                                            {test.title}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>Belum ada tes yang tersedia</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 z-10 pointer-events-none transition-colors" />
                    </div>
                    {availableTests.length === 0 && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-2xl text-[13px] font-medium border border-red-100 mt-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Maaf, belum ada ujian yang bisa diikuti sekarang.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-16 rounded-[1.5rem] shadow-xl shadow-indigo-200 active:scale-[0.97] transition-all text-lg"
                    disabled={isLoading || !selectedTestId}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Tunggu Sebentar...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            Mulai Sekarang
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    )}
                </Button>
            </div>
        </form>
    );
}