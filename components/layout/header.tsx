import Link from "next/link"
import { GraduationCap } from "lucide-react"

interface HeaderProps {
  showAdminLink?: boolean
}

export function Header({ showAdminLink = true }: HeaderProps) {
  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
        <GraduationCap className="h-8 w-8 text-blue-600" />
        <span>MTS Cendekia</span>
      </Link>
      {showAdminLink && (
        <Link href="/admin/login" className="text-sm font-medium text-slate-500 hover:text-blue-600">
          Login Admin/Guru
        </Link>
      )}
    </nav>
  )
}
