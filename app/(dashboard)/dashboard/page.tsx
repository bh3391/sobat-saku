import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const categoryIcons: { [key: string]: any } = {
  "Makanan": Utensils,
  "Transportasi": Car,
  "Belanja": ShoppingBag,
  "Tagihan": Receipt,
  "Hiburan": Film,
  "Kesehatan": HeartPulse,
  "Penghasilan": Plus,
  "Lainnya": MoreHorizontal,
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const transactions = await db.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
    take: 5 
  });

  const allTransactions = await db.transaction.findMany({ where: { userId }, include: { category: true } });
  const totalIncome = allTransactions.filter(t => t.category.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = allTransactions.filter(t => t.category.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-md mx-auto space-y-5 pb-20"> {/* Max-width kecil untuk mobile */}
      
      {/* --- KARTU SALDO (Lebih Compact) --- */}
      <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-100/20 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Saldo Bersih</p>
          <h3 className={`text-3xl font-black tracking-tight ${balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
            Rp {balance.toLocaleString('id-ID')}
          </h3>
          
          <div className="flex gap-4 mt-6 pt-5 border-t border-white/10">
            <div className="flex-1">
              <p className="text-[9px] text-slate-500 uppercase font-black mb-1 flex items-center gap-1">
                <ArrowUpRight className="w-2 h-2 text-green-400" /> Masuk
              </p>
              <p className="font-bold text-sm text-green-400">+{totalIncome.toLocaleString('id-ID')}</p>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="flex-1">
              <p className="text-[9px] text-slate-500 uppercase font-black mb-1 flex items-center gap-1">
                <ArrowDownRight className="w-2 h-2 text-red-400" /> Keluar
              </p>
              <p className="font-bold text-sm text-red-400">-{totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TRANSAKSI TERAKHIR (Dibuat Lebih Slim) --- */}
      <section className="px-1">
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="font-black text-sm uppercase tracking-widest text-slate-400">Terakhir</h4>
          <Link href="/dashboard/transactions" className="text-blue-500 font-bold text-xs bg-blue-50 px-3 py-1 rounded-full">
            Semua
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs italic">Belum ada catatan.</div>
          ) : (
            transactions.map((t, index) => {
              const Icon = categoryIcons[t.category.name] || MoreHorizontal;
              const isIncome = t.category.type === "INCOME";

              return (
                <div key={t.id} className={`flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors ${index !== transactions.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isIncome ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-600"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-[13px] leading-none mb-1 capitalize truncate max-w-[120px]">
                        {t.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                        {t.category.name} • {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-[14px] ${isIncome ? "text-green-600" : "text-slate-900"}`}>
                      {isIncome ? "+" : "-"} {t.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}