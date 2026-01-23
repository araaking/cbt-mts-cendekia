import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  User,
  Settings2,
  LockKeyhole
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 overflow-hidden relative">
      
      {/* Subtle Background Pattern - Modern Minimalist */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      {/* Top Navbar - Minimalist */}
      <nav className="relative z-10 w-full px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group transition-all">
          <div className="w-9 h-9 bg-slate-950 flex items-center justify-center rounded-xl rotate-3 group-hover:rotate-0 transition-transform">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-none text-slate-900">MTS Cendekia</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] leading-tight">Mandiri CBT</span>
          </div>
        </div>

        <Link href="/admin/login">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 font-medium gap-2">
            <Settings2 className="h-4 w-4" />
            Portal Staf
          </Button>
        </Link>
      </nav>

      {/* Main Portal Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        
        {/* Status Indicator */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-slate-200 bg-slate-50/50 text-slate-600 font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistem Ujian Online Aktif
          </Badge>
        </div>

        {/* Hero Typography */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-950 leading-[1.1]">
            Masuki Ruang <br />
            <span className="italic font-serif text-slate-400">Asesmen Digital</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            Selamat datang di portal CBT internal. Siapkan kredensial anda dan pastikan koneksi internet stabil sebelum memulai ujian.
          </p>
        </div>

        {/* Action Cards - Single Focus */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <Link href="/register" className="flex-[1.5]">
            <Button className="w-full h-16 rounded-2xl text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all hover:-translate-y-1 active:scale-[0.98] gap-3">
              <LockKeyhole className="h-5 w-5 opacity-80" />
              Masuk & Kerjakan
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/register" className="flex-1">
            <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-semibold border-slate-200 bg-white hover:bg-slate-50 transition-all gap-3 text-slate-700">
              <User className="h-5 w-5 opacity-60" />
              Daftar Akun
            </Button>
          </Link>
        </div>

        {/* Internal Trust Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-6">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">Anti-Cheat System</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <div className="h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold italic">i</div>
            <span className="text-sm font-semibold tracking-wide uppercase">Auto-Save Progress</span>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 p-8 flex justify-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
        &copy; {new Date().getFullYear()} MTS Cendekia Mandiri &bull; Academic Portal
      </footer>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60 transition-all animate-pulse"></div>
    </div>
  );
}