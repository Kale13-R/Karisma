import type { Metadata, Viewport } from 'next'
import './globals.css'
import AnimateWrapper from '@/components/AnimateWrapper'
import { CartProvider } from '@/context/CartContext'
import { UserProvider } from '@/context/UserContext'
import Header from '@/components/layout/Header'
import CartDrawer from '@/components/layout/CartDrawer'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'KARISMA',
  description: 'Exclusive streetwear drops.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <UserProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <div className="flex-1">
              <AnimateWrapper>{children}</AnimateWrapper>
            </div>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  )
}
