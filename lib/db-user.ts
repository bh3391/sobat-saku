import { db } from "@/lib/db"; // Pastikan kamu sudah punya export prisma client di sini
import { auth, currentUser } from "@clerk/nextjs/server";

export const syncUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  // Cek apakah user sudah ada di DB
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  // Jika belum ada, buat baru
  if (!existingUser) {
    return await db.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  return existingUser;
};