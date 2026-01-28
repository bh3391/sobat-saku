import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Handler untuk menghapus transaksi spesifik berdasarkan ID.
 * Menggunakan konvensi Next.js 15 di mana params adalah Promise.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verifikasi User (Hanya user yang login yang bisa akses)
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Anda harus login terlebih dahulu" }), 
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Unwrap Params (Wajib untuk Next.js 15)
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // 3. Validasi keberadaan ID
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: "ID Transaksi diperlukan" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Proses Penghapusan di Database
    // Kita filter berdasarkan ID DAN userId untuk mencegah user menghapus data milik orang lain
    const deletedTransaction = await db.transaction.delete({
      where: {
        id: id,
        userId: userId, 
      },
    });

    // 5. Response Berhasil
    return NextResponse.json({
      message: "Transaksi berhasil dihapus",
      data: deletedTransaction
    });

  } catch (error: any) {
    console.error("[TRANSACTION_DELETE_ERROR]:", error);

    // Cek jika error karena data tidak ditemukan
    if (error.code === 'P2025') {
      return new NextResponse(
        JSON.stringify({ message: "Transaksi tidak ditemukan atau Anda tidak memiliki akses" }), 
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Error umum lainnya
    return new NextResponse(
      JSON.stringify({ 
        message: "Internal Server Error", 
        error: error.message 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}