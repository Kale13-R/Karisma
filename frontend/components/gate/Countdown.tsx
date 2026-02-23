interface CountdownProps {
  timeRemaining: number
}

export default function Countdown({ timeRemaining }: CountdownProps) {
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return (
    <div>
      <p>{hours}h {minutes}m {seconds}s</p>
    </div>
  )
}
