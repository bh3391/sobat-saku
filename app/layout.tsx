import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SobatSaku - Atur Duit Jadi Mudah',
  description: 'Aplikasi pencatat keuangan dengan suara',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className={inter.className}>
          {children}
          <Toaster 
            position="bottom-center" 
            richColors 
            // Gunakan properti style langsung atau hilangkan jika tidak sangat mendesak
            style={{ zIndex: 99999 }} 
            // Jika masih error, gunakan asersi 'any' untuk melewati pengecekan build
            {...({ style: { zIndex: 99999 } } as any)}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}