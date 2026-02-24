import os

# Must run before any app module is imported so Settings() resolves cleanly
os.environ.setdefault("GATE_PASSWORD", "test-gate-password")
os.environ.setdefault("SESSION_SECRET", "test-session-secret-key-for-testing-only-32ch")
