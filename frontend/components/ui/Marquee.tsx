'use client'

interface MarqueeProps {
  text?: string
  speed?: number  // seconds per full cycle, default 18
}

export default function Marquee({
  text = 'KARISMA · SS26 · NEW RELEASE · DROP NOW · KARISMA WORLDWIDE · ',
  speed = 18,
}: MarqueeProps) {
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 0',
      backgroundColor: 'var(--bg)',
      userSelect: 'none',
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: `marquee ${speed}s linear infinite`,
      }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <span key={i} style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--fg)',
            whiteSpace: 'nowrap',
            paddingRight: '80px',
          }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
