import { UserButton } from "@clerk/nextjs";
import { navItems } from "@/lib/navigation";
import { syncUser } from "@/lib/db-user";
import Link from "next/link";
import { Toaster } from "sonner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    await syncUser()
  return (
    <div className="flex min-h-screen bg-white text-slate-900">
      
      {/* --- SIDEBAR (Desktop Only: md ke atas) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl">S</div>
          <span className="font-bold text-xl tracking-tight text-blue-600">SobatSaku</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition font-medium text-slate-600 hover:text-blue-600 group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">AKUN SAYA</p>
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      <div className="sm:hidden ">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-100">
        <div className="max-w-md mx-auto px-6 h-16 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">
              Sobat<span className="text-blue-600">Saku</span>
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em]">Sistem Aktif</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-0.5 border-2 border-blue-50 rounded-full shadow-sm">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 pb-24  mt-20 md:mt-0 md:pb-0">
        {/* Header Desktop (Cuma muncul di desktop untuk sapa user) */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 bg-white border-b border-slate-100">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
             {/* Notifikasi atau lainnya */}
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
          <Toaster position="bottom-center" richColors />
        </div>
      </main>

      {/* --- BOTTOM NAVIGATION (Mobile Only: hidden di md ke atas) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              item.special 
                ? "bg-blue-600 text-white p-4 rounded-full -translate-y-8 shadow-xl shadow-blue-200 border-4 border-slate-50" 
                : "text-slate-400"
            }`}
          >
            <item.icon className={`${item.special ? "w-6 h-6" : "w-5 h-5"}`} />
            {!item.special && <span className="text-[10px] font-bold">{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}