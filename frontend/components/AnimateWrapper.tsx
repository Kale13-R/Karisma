'use client'

import { AnimatePresence } from 'framer-motion'

export default function AnimateWrapper({ children }: { children: React.ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
}
