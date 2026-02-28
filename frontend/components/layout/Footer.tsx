'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const FOOTER_LINKS = [
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/archive', label: 'ARCHIVE' },
]

export default function Footer() {
  const pathname = usePathname()

  if (pathname === '/gate') return null

  return (
    <footer className="border-t border-[var(--border)] mt-auto py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-8">
        <p className="text-[10px] tracking-[0.3em] text-[var(--fg-muted)] uppercase">
          KARISMA &copy; 2019
        </p>
        <nav className="flex gap-8">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[10px] tracking-[0.3em] text-[var(--fg-muted)] hover:text-[var(--fg)] uppercase transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
