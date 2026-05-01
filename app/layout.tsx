import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/lib/CartContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mariam Beauty - Premium Beauty & Skincare',
  description: 'Shop premium beauty and skincare products at Mariam Beauty',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  )
}