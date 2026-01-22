"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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
        } else if (availableTests.length > 0 && !selectedTestId) {
             // Optional: select the first one or leave empty?
             // Leaving empty forces user to choose if multiple exist.
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" placeholder="Masukkan nama lengkap sesuai ijazah" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="nisn">NISN <span className="text-slate-400 font-normal">(Opsional)</span></Label>
                <Input id="nisn" name="nisn" placeholder="Nomor Induk Siswa Nasional" type="number" />
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="test">Pilih Tes</Label>
                <Select 
                    value={selectedTestId} 
                    onValueChange={setSelectedTestId}
                >
                    <SelectTrigger id="test">
                        <SelectValue placeholder="Pilih jenis tes" />
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
                    <p className="text-xs text-red-500">
                        *Tidak ada tes yang aktif saat ini.
                    </p>
                )}
            </div>
            
            <div className="pt-4">
                 <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading || !selectedTestId}
                 >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Lanjut ke Tes &rarr;
                 </Button>
            </div>
        </form>
    );
}
