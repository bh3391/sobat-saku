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
  containerStyle={{ zIndex: 99999 }} // Paksa paling atas
/>
        </body>
      </html>
    </ClerkProvider>
  )
}