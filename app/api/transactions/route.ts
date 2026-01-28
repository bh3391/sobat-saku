import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { amount, description, type, categoryName: categoryFromFront } = body;

    if (!amount || !type) {
      return new NextResponse("Missing amount or type", { status: 400 });
    }

    const finalCategoryName = categoryFromFront || (type === "INCOME" ? "Penghasilan" : "Lainnya");

    // Cari atau Buat Kategori
    let category = await db.category.findUnique({
      where: { name: finalCategoryName }
    });

    if (!category) {
      category = await db.category.create({
        data: {
          name: finalCategoryName,
          type: type 
        }
      });
    }

    // Simpan Transaksi
    const transaction = await db.transaction.create({
      data: {
        amount: parseFloat(amount),
        description: description || "Tanpa deskripsi",
        userId: userId,
        categoryId: category.id,
      },
      include: { category: true }
    });

    return NextResponse.json(transaction);

  } catch (error: any) {
    console.error("[TRANSACTION_POST_ERROR]:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}