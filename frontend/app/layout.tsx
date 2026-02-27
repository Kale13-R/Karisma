import type { Metadata } from 'next'
import './globals.css'
import AnimateWrapper from '@/components/AnimateWrapper'

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
        <AnimateWrapper>{children}</AnimateWrapper>
      </body>
    </html>
  )
}
