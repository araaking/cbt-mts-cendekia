"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react"
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column: Form */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="bg-blue-100 p-2 rounded-lg inline-flex mb-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Selamat Datang</h1>
            <p className="text-slate-500">
              Masuk ke dashboard admin untuk mengelola sistem CBT.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@mtscendekia.sch.id"
                required
                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="h-11 pr-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/10" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Masuk Dashboard
            </Button>
          </form>

          <p className="px-8 text-center text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 underline underline-offset-4 transition-colors">
              &larr; Kembali ke Homepage
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column: Visual */}
      <div className="hidden lg:flex flex-col items-center justify-center relative bg-slate-900 text-white overflow-hidden p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center border border-white/20 shadow-2xl">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Keamanan & Integritas</h2>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              &ldquo;Sistem CBT kami didesain untuk menjamin keamanan data dan integritas ujian dengan teknologi enkripsi terkini.&rdquo;
            </p>
          </div>

          <div className="pt-8 flex justify-center gap-4 text-sm font-medium text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              Enkripsi End-to-End
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              Monitoring Real-time
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
      </div>
    </div>
  )
}
