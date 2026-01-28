"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VoiceInputPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState("Tekan tombol untuk mulai bicara");
  const [parsedData, setParsedData] = useState<{amount: number, desc: string, type: "INCOME" | "EXPENSE", category: string} | null>(null);
  const router = useRouter();
  
  // Ref untuk menyimpan instance recognition agar tidak hilang saat re-render
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Inisialisasi Speech Recognition
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatus("Mendengarkan...");
      };

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processText(text); // Jalankan fungsi parsing angka
        setIsListening(false);
        setStatus("Sudah benar, Sobat?");
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatus("Izin Mic ditolak. Cek setting browser.");
        } else {
          setStatus("Gagal dengar. Coba bicara lagi.");
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // FUNGSI PINTAR: Mengubah teks jadi angka (Contoh: "Kopi 25 ribu" -> 25000)
  const processText = (text: string) => {
  const lowerText = text.toLowerCase();
  
  // 1. Identifikasi Tipe (Income/Expense)
  const incomeKeywords = ["gaji", "bonus", "dapat", "transfer masuk", "hadiah", "jual", "pemasukan", "untung"];
  const isIncome = incomeKeywords.some(k => lowerText.includes(k));
  const type = isIncome ? "INCOME" : "EXPENSE";

  // 2. Identifikasi Kategori (Smart Mapping)
  let categoryName = isIncome ? "Penghasilan" : "Lainnya";

  if (!isIncome) {
    const categoryMap: { [key: string]: string[] } = {
      "Makanan": ["makan", "minum", "kopi", "seblak", "nasi", "bakso", "restoran", "jajan", "cemilan"],
      "Transportasi": ["bensin", "pertamax", "pertalite", "ojek", "grab", "gojek", "parkir", "tol", "bus"],
      "Belanja": ["beli", "shopee", "tokopedia", "baju", "kaos", "celana", "sabun", "skincare"],
      "Tagihan": ["listrik", "pdam", "internet", "wifi", "pulsa", "kuota", "langganan", "netflix"],
      "Hiburan": ["nonton", "bioskop", "game", "topup", "healing", "wisata"],
      "Kesehatan": ["obat", "apotek", "dokter", "rs", "rumah sakit", "vitamin"]
    };

    // Cari kategori yang cocok
    for (const [name, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(k => lowerText.includes(k))) {
        categoryName = name;
        break;
      }
    }
  }

  // 3. Parsing Angka
  const numbers = lowerText.match(/\d+/g);
  let amount = 0;
  if (numbers) {
    amount = parseInt(numbers.join(""));
    if (lowerText.includes("ribu") && amount < 1000) amount *= 1000;
    if (lowerText.includes("juta") && amount < 1000000) amount *= 1000000;
  }

  setParsedData({
    amount: amount,
    desc: text,
    type: type,
    category: categoryName // Tambahkan field category di state
  });
};
  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Browser kamu tidak mendukung Speech Recognition.");
      return;
    }
    setTranscript("");
    setParsedData(null);
    recognitionRef.current.start();
  };

  const handleSave = async () => {
  // Tambahkan pengecekan ketat sebelum fetch
  if (!parsedData || !parsedData.amount || !parsedData.type) {
    alert("Data belum lengkap. Silakan bicara lagi.");
    return;
  }

  try {
    const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: parsedData.amount,
      description: parsedData.desc,
      type: parsedData.type,
      categoryName: parsedData.category, // Kirim hasil deteksi kategori
    }),
  });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Server says:", errorData);
      throw new Error("Gagal simpan");
    }
    
    router.push("/dashboard");
    router.refresh();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col text-white px-6 py-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>

      {/* Header */}
      <div className="relative flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold tracking-[0.2em] text-blue-400 uppercase">Voice Input</h1>
        </div>
        <div className="w-11"></div>
      </div>

      {/* Mic Animation Section */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative mb-16">
          {isListening && (
            <>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 scale-[2]"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse opacity-40 scale-[1.5]"></div>
            </>
          )}
          <button 
            onClick={isListening ? () => {} : startListening}
            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
              isListening 
                ? "bg-red-500 shadow-red-900/50 scale-110" 
                : "bg-blue-600 shadow-blue-900/50 hover:scale-105"
            }`}
          >
            {isListening ? (
              <Loader2 className="w-12 h-12 animate-spin" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>
        </div>

        <div className="text-center max-w-xs mx-auto">
          <p className={`text-xl font-bold mb-2 transition-colors ${isListening ? "text-blue-400" : "text-white"}`}>
            {status}
          </p>
          {!isListening && !transcript && (
            <p className="text-slate-500 text-sm">Ketuk mic untuk mulai merekam pengeluaranmu.</p>
          )}
        </div>

        {/* Display Result Card */}
        {transcript && (
          <div className="mt-12 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Hasil Suara:</p>
            <p className="text-2xl font-medium leading-tight text-blue-100 italic mb-6">
              "{transcript}"
            </p>
            
            {parsedData && parsedData.amount > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-600/30 rounded-2xl border border-blue-400/30">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-200 font-bold uppercase">Terdeteksi Nominal</p>
                  <p className="text-xl font-black text-white">Rp {parsedData.amount.toLocaleString('id-ID')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mt-auto">
        {transcript && !isListening ? (
          <>
            <button 
              onClick={() => {setTranscript(""); setParsedData(null); setStatus("Tekan tombol untuk mulai bicara");}}
              className="bg-white/5 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition border border-white/5"
            >
              <X className="w-5 h-5" /> Ulangi
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900 transition hover:bg-blue-500"
            >
              <Check className="w-5 h-5" /> Simpan
            </button>
          </>
        ) : (
          <div className="col-span-2 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>Sebutkan nama barang & harganya</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}