"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Loader2, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/shared/lib/auth-client"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { error } = await authClient.signIn.email({ email, password })
      
      if (error) {
        toast.error("Login Gagal", {
          description: error.message || "Email atau password salah",
        })
        return
      }

      toast.success("Login Berhasil", {
        description: "Selamat datang kembali!",
      })
      router.push("/dashboard")
    } catch {
      toast.error("Error", {
        description: "Terjadi kesalahan saat login",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="bg-slate-900 p-3 rounded-xl shadow-lg">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">MTS Cendekia</h1>
        <p className="text-slate-500 text-sm">Sistem CBT Terintegrasi</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Login Staff</CardTitle>
          <CardDescription>Masuk sebagai Admin atau Guru</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="nama@mtscendekia.sch.id" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Masuk
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-slate-50/50 p-4 rounded-b-xl">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            &larr; Kembali ke Halaman Utama
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
