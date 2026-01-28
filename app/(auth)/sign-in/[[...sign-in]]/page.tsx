import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Selamat Datang Kembali</h1>
        <p className="text-slate-500">Masuk ke SobatSaku untuk kelola duitmu.</p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
            card: "shadow-2xl border border-slate-200 rounded-3xl",
          }
        }}
      />
    </div>
  );
}