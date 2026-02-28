const pad = (n: number): string => String(n).padStart(2, '0')

interface CountdownProps {
  timeRemaining: number
}

export default function Countdown({ timeRemaining }: CountdownProps) {
  const totalSeconds = Math.floor(timeRemaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        gap: '24px',
      }}
    >
      <div
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 'clamp(48px, 10vw, 96px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          lineHeight: 1,
        }}
      >
        {`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}
      </div>
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.45em',
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
        }}
      >
        DROP INCOMING
      </p>
    </div>
  )
}
