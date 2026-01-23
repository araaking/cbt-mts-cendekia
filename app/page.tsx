import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer transition-opacity hover:opacity-80">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">MTS Cendekia</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                Login Admin
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-slate-50"></div>

          <div className="container mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-100 transition-colors">
              ✨ Penerimaan Siswa Baru Tahun 2024
            </Badge>

            <h1 className="max-w-4xl mx-auto text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Platform Ujian Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                MTS Cendekia
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Sistem Computer Based Test (CBT) modern untuk seleksi yang transparan, cepat, dan akurat. Bergabunglah bersama kami mencapai masa depan gemilang.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 rounded-full text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5">
                  Mulai Tes Sekarang
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-base border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900">
                  Sudah punya akun?
                </Button>
              </Link>
            </div>

            {/* Stats / Trust */}
            <div className="mt-20 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Peserta Terdaftar", value: "500+" },
                { label: "Soal Ujian", value: "1000+" },
                { label: "Durasi Rata-rata", value: "90 Menit" },
                { label: "Tingkat Kelulusan", value: "85%" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white border-t border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa CBT MTS Cendekia?</h2>
              <p className="text-slate-600">Platform kami dirancang untuk memberikan pengalaman ujian terbaik, fokus pada kemudahan dan integritas.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-0 shadow-none bg-slate-50 rounded-2xl overflow-hidden hover:bg-slate-100 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Antarmuka Modern</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Desain yang bersih dan intuitif memudahkan peserta fokus pada soal tanpa gangguan teknis.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-slate-50 rounded-2xl overflow-hidden hover:bg-slate-100 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-green-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Sistem Aman</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Proteksi berlapis memastikan integritas ujian dan kerahasiaan data setiap peserta.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-none bg-slate-50 rounded-2xl overflow-hidden hover:bg-slate-100 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Hasil Real-time</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Sistem penilaian otomatis yang cepat dan akurat, hasil langsung diproses ke server.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-slate-400" />
            <span className="font-semibold text-slate-700">MTS Cendekia</span>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} MTS Cendekia. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}
