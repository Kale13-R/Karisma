'use client'

import { useEffect, useRef, useState } from 'react'
import Countdown from '@/components/gate/Countdown'
import PasswordEntry from '@/components/gate/PasswordEntry'
import type { DropState } from '@/types'

export default function GatePage() {
  // Default 'open' so content renders on first paint — useEffect corrects to
  // 'countdown' on next tick if NEXT_PUBLIC_DROP_TIMESTAMP is set
  const [dropState, setDropState] = useState<DropState>({
    status: 'open',
    timeRemaining: null,
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  // Drop-time check
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

  // Manual loop: seek to 0 when the video is ~0.15 s from its end so the
  // browser never hits the native loop-seek frame which causes the flash
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.15) {
        video.currentTime = 0
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Video — no `loop` attr; manual seek handles it to avoid frame flash */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ backgroundColor: '#000' }}
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
