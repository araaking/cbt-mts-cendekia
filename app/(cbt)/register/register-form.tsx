"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronRight, User, AlertCircle } from "lucide-react";
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

    // Update selectedTestId based on URL or available tests
    useEffect(() => {
        if (urlTestId) {
            // Check if the URL test ID is in the available tests list
            const isValid = availableTests.some(t => t.id === urlTestId);
            if (isValid) {
                setSelectedTestId(urlTestId);
            }
        } else if (availableTests.length === 1) {
            // Auto-select if only one test is available
            setSelectedTestId(availableTests[0].id);
        }
    }, [urlTestId, availableTests]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedTestId) {
            toast({
                title: "Pilih Tes",
                description: "Silakan pilih tes terlebih dahulu.",
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

            // Save session
            localStorage.setItem("cbt_session_token", data.id);

            toast({
                title: "Registrasi Berhasil",
                description: "Mengalihkan ke halaman tes...",
            });

            // Redirect to test
            router.push(`/test/${selectedTestId}`);
        } catch (error: any) {
            toast({
                title: "Gagal",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-medium">Nama Lengkap</Label>
                    <div className="relative">
                        <Input
                            id="name"
                            name="name"
                            placeholder="Contoh: Ahmad Fauzan"
                            required
                            className="h-11 pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                        />
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nisn" className="text-slate-700 font-medium">
                        NISN <span className="text-slate-400 font-normal text-xs ml-1">(Opsional)</span>
                    </Label>
                    <Input
                        id="nisn"
                        name="nisn"
                        placeholder="Nomor Induk Siswa Nasional"
                        type="number"
                        className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="test" className="text-slate-700 font-medium">Pilih Ujian</Label>
                    <Select
                        value={selectedTestId}
                        onValueChange={setSelectedTestId}
                    >
                        <SelectTrigger id="test" className="h-11 bg-slate-50 border-slate-200 focus:bg-white">
                            <SelectValue placeholder="Pilih mata ujian" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTests.length > 0 ? (
                                availableTests.map((test) => (
                                    <SelectItem key={test.id} value={test.id}>
                                        {test.title}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none" disabled>Tidak ada tes aktif</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {availableTests.length === 0 && (
                        <div className="flex items-center gap-2 text-red-500 bg-red-50 p-2 rounded-md text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Tidak ada tes yang aktif saat ini.</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                    disabled={isLoading || !selectedTestId}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            Mulai Mengerjakan
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
