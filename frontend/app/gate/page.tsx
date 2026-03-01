'use client'

import { useEffect, useState } from 'react'
import Countdown from '@/components/gate/Countdown'
import PasswordEntry from '@/components/gate/PasswordEntry'
import type { DropState } from '@/types'

export default function GatePage() {
  const [dropState, setDropState] = useState<DropState>({
    status: 'loading',
    timeRemaining: null,
  })

  useEffect(() => {
    const dropTimestamp = process.env.NEXT_PUBLIC_DROP_TIMESTAMP

    if (!dropTimestamp) {
      setDropState({ status: 'open', timeRemaining: null })
      return
    }

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
    <div className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
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
