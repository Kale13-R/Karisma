import type { Metadata } from 'next'
import './globals.css'
import AnimateWrapper from '@/components/AnimateWrapper'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import CartDrawer from '@/components/layout/CartDrawer'

export const metadata: Metadata = {
  title: 'KARISMA',
  description: 'Exclusive streetwear drops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <Header />
          <CartDrawer />
          <AnimateWrapper>{children}</AnimateWrapper>
        </CartProvider>
      </body>
    </html>
  )
}
