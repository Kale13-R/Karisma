export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Courier New', Courier, monospace",
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
      }}
    >
      <p style={{ fontSize: '11px', letterSpacing: '0.45em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>
        ABOUT — COMING SOON
      </p>
    </main>
  )
}
