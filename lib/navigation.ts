import { LayoutDashboard, ReceiptText, PieChart, Settings, Mic } from "lucide-react";

export const navItems = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", href: "/dashboard/transactions", icon: ReceiptText },
  { name: "Input", href: "/dashboard/voice", icon: Mic, special: true }, // Untuk tombol suara
  { name: "Budget", href: "/dashboard/budget", icon: PieChart },
  { name: "Setelan", href: "/dashboard/settings", icon: Settings },
];