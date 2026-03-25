'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Page-transition wrapper — fade in WITHOUT remounting page components.
 *
 * Key insight: useEffect fires AFTER the browser paints, so new content
 * would flash visible at full opacity for one frame before any animation
 * could hide it. useLayoutEffect fires synchronously before the browser
 * paints, letting us snap to opacity:0 first so the user never sees the
 * "pop in" of new content.
 *
 * Sequence on navigation:
 *  1. React renders new page children into this div
 *  2. useLayoutEffect fires (pre-paint): snap wrapper to opacity:0 instantly
 *  3. Browser paints → new content is invisible (no flash)
 *  4. Two requestAnimationFrames later: CSS transition fades opacity back to 1
 *
 * No AnimatePresence / key={pathname} means React never unmounts/remounts
 * the page component, so useEffect only fires once and media keeps playing.
 */
export default function AnimateWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const isFirstMount = useRef(true)
  const prevPathname = useRef(pathname)

  useLayoutEffect(() => {
    // Skip animation on initial render
    if (isFirstMount.current) {
      isFirstMount.current = false
      prevPathname.current = pathname
      return
    }

    if (prevPathname.current === pathname) return
    prevPathname.current = pathname

    const el = ref.current
    if (!el) return

    // Snap to invisible BEFORE browser paints new content (no flash)
    el.style.transition = 'none'
    el.style.opacity = '0'
    el.style.transform = 'translateY(6px)'

    // Double rAF: first ensures the "opacity:0" frame is committed,
    // second starts the CSS transition so the browser animates the fade-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition =
          'opacity 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    })
  }, [pathname])

  return (
    <div ref={ref} style={{ opacity: 1, transform: 'translateY(0)' }}>
      {children}
    </div>
  )
}
