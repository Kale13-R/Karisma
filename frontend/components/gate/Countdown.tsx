interface CountdownProps {
  timeRemaining: number
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export default function Countdown({ timeRemaining }: CountdownProps) {
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

  return (
    <div>
      <p>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</p>
    </div>
  )
}
