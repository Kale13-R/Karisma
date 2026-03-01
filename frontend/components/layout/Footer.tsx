'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { label: 'ABOUT', href: '/about' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'ARCHIVE', href: '/archive' },
  {
    label: 'INSTAGRAM',
    href: 'https://www.instagram.com/karismaworldwide/',
    external: true,
  },
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="text-[10px] tracking-[0.3em] text-[var(--fg-muted)] hover:text-[var(--fg)] uppercase transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
