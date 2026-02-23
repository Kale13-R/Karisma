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

  if (dropState.status === 'loading') return null
  if (dropState.status === 'countdown') {
    return <Countdown timeRemaining={dropState.timeRemaining!} />
  }

  return <PasswordEntry />
}
