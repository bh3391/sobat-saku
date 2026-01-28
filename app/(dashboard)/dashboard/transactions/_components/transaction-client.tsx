"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse, 
  MoreHorizontal, Plus, ArrowUpRight, ArrowDownRight, 
  Trash2, Wallet 
} from "lucide-react";
import { useRouter } from "next/navigation";

const categoryIcons: { [key: string]: any } = {
  "Makanan": Utensils, "Transportasi": Car, "Belanja": ShoppingBag,
  "Tagihan": Receipt, "Hiburan": Film, "Kesehatan": HeartPulse,
  "Penghasilan": Plus, "Lainnya": MoreHorizontal,
};

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#f43f5e", "#fb923c", "#10b981"];

// --- Fungsi Helper untuk Detail Chart ---
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill}
      />
      <Sector
        cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle}
        innerRadius={outerRadius + 12} outerRadius={outerRadius + 14} fill={fill}
      />
    </g>
  );
};

export default function TransactionClient({ initialData, categories }: any) {
  const [transactions, setTransactions] = useState(initialData);
  const [filter, setFilter] = useState("SEMUA");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const router = useRouter();

  // --- Logika Hapus (Swipe to Delete) ---
  const handleDelete = async (id: string) => {
    const originalData = [...transactions];
    setTransactions(transactions.filter((t: any) => t.id !== id));
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch (error) {
      setTransactions(originalData);
      alert("Gagal menghapus transaksi");
    }
  };

  // --- Logika Chart 1: Cashflow ---
  const income = transactions.filter((t: any) => t.category.type === "INCOME").reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const expense = transactions.filter((t: any) => t.category.type === "EXPENSE").reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const cashflowData = [
    { name: "Masuk", value: income, color: "#10b981" },
    { name: "Keluar", value: expense, color: "#334155" },
  ];

  // --- Logika Chart 2: Alokasi Kategori ---
  const expenseTransactions = transactions.filter((t: any) => t.category.type === "EXPENSE");
  const categoryData = categories
    .filter((cat: any) => cat.type === "EXPENSE")
    .map((cat: any) => {
      const total = expenseTransactions.filter((t: any) => t.categoryId === cat.id).reduce((acc: number, curr: any) => acc + curr.amount, 0);
      return { name: cat.name, value: total };
    })
    .filter((data: any) => data.value > 0)
    .sort((a: any, b: any) => b.value - a.value);

  // --- Logika Summary Bar (Per Kategori) ---
  const activeSummary = useMemo(() => {
    const filtered = transactions.filter((t: any) => filter === "SEMUA" ? true : t.category.name === filter);
    const total = filtered.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return { total, count: filtered.length, type: filtered[0]?.category.type, name: filter };
  }, [filter, transactions]);

  const filteredTransactions = transactions.filter((t: any) => filter === "SEMUA" ? true : t.category.name === filter);

  return (
    <div className="space-y-6 pb-24">
      {/* --- SECTION 1: DOUBLE CHARTS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Cashflow Ratio */}
        <div className="bg-slate-900 rounded-[2.5rem] p-5 text-white shadow-xl h-60">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 text-center">Struktur Cashflow</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cashflowData} innerRadius={40} outerRadius={55} paddingAngle={8} dataKey="value" stroke="none">
                  {cashflowData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-[10px] font-bold text-green-400">
            Ratio Income: {((income / (income + expense || 1)) * 100).toFixed(0)}%
          </p>
        </div>

        {/* Card 2: Expense Allocation (Clickable) */}
        <div className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm h-72">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 text-center">Alokasi Belanja</h4>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex === null ? undefined : activeIndex}
                  activeShape={renderActiveShape}
                  data={categoryData}
                  innerRadius={35} outerRadius={50} dataKey="value" stroke="none"
                  onClick={(_, index) => setActiveIndex(activeIndex === index ? null : index)}
                >
                  {categoryData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 h-10 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {activeIndex !== null ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                  <p className="text-[10px] font-black text-blue-500 uppercase">{categoryData[activeIndex].name}</p>
                  <p className="font-bold text-sm">Rp {categoryData[activeIndex].value.toLocaleString('id-ID')}</p>
                </motion.div>
              ) : (
                <p className="text-[9px] text-slate-300 italic">Klik warna chart untuk detail</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: STICKY FILTERS & SUMMARY --- */}
      <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md -mx-4 px-4 py-3 border-b border-slate-100 space-y-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar touch-pan-x">
          <button onClick={() => setFilter("SEMUA")} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 ${filter === "SEMUA" ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}>
            Semua
          </button>
          {categories.map((cat: any) => (
            <button key={cat.id} onClick={() => { setFilter(cat.name); setActiveIndex(null); }} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shrink-0 ${filter === cat.name ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Wallet className="w-3.5 h-3.5" /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total {filter}</p>
            </div>
            <div className="text-right">
              <p className={`text-[15px] font-black ${activeSummary.type === 'INCOME' ? 'text-green-600' : 'text-slate-900'}`}>
                Rp {activeSummary.total.toLocaleString('id-ID')}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{activeSummary.count} Transaksi</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- SECTION 3: TRANSACTION LIST (Swipe to Delete) --- */}
      <div className="space-y-3 px-1">
        <AnimatePresence initial={false} mode="popLayout">
          {filteredTransactions.map((t: any) => {
            const Icon = categoryIcons[t.category.name] || MoreHorizontal;
            const isIncome = t.category.type === "INCOME";

            return (
              <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }} className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-[1.5rem] flex items-center justify-end px-6 text-white"><Trash2 className="w-5 h-5" /></div>
                
                <motion.div
                  drag="x" dragConstraints={{ left: -100, right: 0 }}
                  onDragEnd={(_, info) => info.offset.x < -80 && handleDelete(t.id)}
                  className="relative bg-white p-4 rounded-[1.5rem] border border-slate-50 shadow-sm flex items-center justify-between touch-pan-y"
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${isIncome ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-600"}`}><Icon className="w-5 h-5" /></div>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 text-[13px] mb-0.5 truncate">{t.description}</p>
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-400">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{t.category.name}</span>
                        <span>{new Date(t.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className={`font-black text-[14px] ${isIncome ? "text-green-600" : "text-slate-900"}`}>{isIncome ? "+" : "-"} {t.amount.toLocaleString('id-ID')}</p>
                    {isIncome ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}