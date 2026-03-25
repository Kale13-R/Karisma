'use client'

import { useEffect, useRef } from 'react'

/**
 * Full-screen film grain overlay.
 * Renders a small noise canvas tile and shifts its background-position
 * every 50ms for a flickering analogue effect.
 */
export default function FilmGrain() {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate a 150×150 noise tile on a canvas
    const size = 150
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(size, size)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)

    const dataUrl = canvas.toDataURL('image/png')
    const el = overlayRef.current
    if (!el) return

    el.style.backgroundImage = `url(${dataUrl})`

    // Flicker by shifting position every 50ms
    let frame: number
    const flicker = () => {
      const x = Math.floor(Math.random() * size)
      const y = Math.floor(Math.random() * size)
      el.style.backgroundPosition = `${x}px ${y}px`
    }

    const id = window.setInterval(flicker, 50)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 0.04,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}
