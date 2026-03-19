'use client'

import { useEffect, useRef, useState } from 'react'
import Countdown from '@/components/gate/Countdown'
import PasswordEntry from '@/components/gate/PasswordEntry'
import type { DropState } from '@/types'

export default function GatePage() {
  const [dropState, setDropState] = useState<DropState>({
    status: 'open',
    timeRemaining: null,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const dropTimestamp = process.env.NEXT_PUBLIC_DROP_TIMESTAMP
    if (!dropTimestamp) return

    const checkTime = () => {
      const now = Date.now()
      const drop = new Date(dropTimestamp).getTime()
      if (now < drop) {
        setDropState({ status: 'countdown', timeRemaining: drop - now })
      } else {
        setDropState({ status: 'open', timeRemaining: null })
      }
    }

    checkTime()
    const interval = setInterval(checkTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    // Fade in as soon as the browser has decoded the first frame.
    // We do this via direct DOM manipulation (not state) so it works even
    // when the browser fires canplay before React has finished hydrating.
    const showVideo = () => {
      v.style.transition = 'opacity 0.4s ease'
      v.style.opacity = '1'
    }
    if (v.readyState >= 2) {
      // Already decoded — show immediately
      showVideo()
    } else {
      v.addEventListener('canplay', showVideo, { once: true })
    }

    // --- Seamless loop ---
    // The video is trimmed to exactly 3 seconds so native looping resets
    // cleanly without any visible reverse or black-frame flash.
    const handleEnded = () => {
      v.currentTime = 0
      v.play().catch(() => {})
    }
    v.addEventListener('ended', handleEnded)

    return () => {
      v.removeEventListener('canplay', showVideo)
      v.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Video starts invisible; fades in when first frame is ready */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      >
        <source src="/videos/karisma-gate.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10">
        {dropState.status === 'countdown' && (
          <Countdown timeRemaining={dropState.timeRemaining!} />
        )}
        {dropState.status === 'open' && <PasswordEntry />}
      </div>
    </div>
  )
}
