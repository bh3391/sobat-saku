import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TransactionClient from "./_components/transaction-client";

export default async function TransactionsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Ambil semua transaksi & kategori
  const transactions = await db.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  const categories = await db.category.findMany({
    where: { 
        transactions: { some: { userId } } 
    }
  });

  return (
    <div className="space-y-8  lg:w-full w-md mx-auto pb-20 bg-white p-10 rounded-lg shadow-sm">
      <header>
        <h2 className="text-2xl font-black text-slate-900">Riwayat</h2>
        <p className="text-sm text-slate-500">Pantau aliran uangmu bulan ini.</p>
      </header>

      {/* Kirim data ke Client Component */}
      <TransactionClient 
        initialData={transactions} 
        categories={categories} 
      />
    </div>
  );
}