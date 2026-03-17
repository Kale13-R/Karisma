import { useState, useEffect } from 'react'

/**
 * SSR-safe media query hook using matchMedia API.
 * Only for behavioral concerns (e.g. animation direction).
 * For layout/styling, use CSS media queries instead.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
