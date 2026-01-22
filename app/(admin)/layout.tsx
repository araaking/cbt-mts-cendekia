import { AdminSidebar } from "@/components/admin/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { headers } from "next/headers"
import { auth } from "@/shared/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar role={session?.user?.role} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Toaster />
    </div>
  )
}
