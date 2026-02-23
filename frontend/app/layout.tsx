import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karisma',
  description: 'Streetwear drop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
