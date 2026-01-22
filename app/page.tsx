import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, Clock, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar Simple */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span>MTS Cendekia</span>
        </div>
        <Link 
          href="/admin/login" 
          className="text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          Login Admin/Guru
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Penerimaan Siswa Baru <br />
              <span className="text-blue-600">MTS Cendekia</span>
            </h1>
            <p className="text-lg text-slate-600">
              Selamat datang di sistem Computer Based Test (CBT). 
              Silakan persiapkan diri Anda untuk mengikuti tes seleksi masuk.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
              <h3 className="font-semibold text-slate-800">Soal Pilihan Ganda</h3>
              <p className="text-sm text-slate-500">Jawab soal-soal pilihan ganda dengan teliti.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <Clock className="h-6 w-6 text-orange-500 mb-2" />
              <h3 className="font-semibold text-slate-800">Waktu Terbatas</h3>
              <p className="text-sm text-slate-500">Perhatikan timer yang berjalan saat mengerjakan.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <h3 className="font-semibold text-slate-800">Hasil Langsung</h3>
              <p className="text-sm text-slate-500">Data jawaban tersimpan otomatis ke server.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-600/20"
            >
              Mulai Tes Sekarang
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              *Pastikan koneksi internet Anda stabil sebelum memulai
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} MTS Cendekia. All rights reserved.
      </footer>
    </div>
  );
}
