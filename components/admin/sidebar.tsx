"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  LogOut,
  GraduationCap,
} from "lucide-react"
import { authClient } from "@/shared/lib/auth-client"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tests", label: "Kelola Tes", icon: FileText },
  { href: "/results", label: "Hasil Tes", icon: ClipboardList },
  { href: "/users", label: "Manajemen User", icon: Users },
]

export function AdminSidebar({ role }: { role?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/admin/login")
  }

  const filteredNavItems = navItems.filter((item) => {
    if (item.label === "Manajemen User" && role !== "ADMIN") {
      return false
    }
    return true
  })

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MTS Cendekia</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
