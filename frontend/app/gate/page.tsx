'use client'

import { useEffect, useState } from 'react'
import Countdown from '@/components/gate/Countdown'
import PasswordEntry from '@/components/gate/PasswordEntry'
import type { DropState } from '@/types'

export default function GatePage() {
  // Default to 'open' so content renders immediately on first paint —
  // useEffect will switch to 'countdown' on next tick if a timestamp exists
  const [dropState, setDropState] = useState<DropState>({
    status: 'open',
    timeRemaining: null,
  })

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

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#000' }}
    >
      {/* Video background — black bg prevents flash on loop seek */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ backgroundColor: '#000' }}
      >
        <source src="/videos/RPReplay_Final1730345188.mp4" type="video/mp4" />
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
