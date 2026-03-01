import os

# Set test environment variables before any app modules are imported.
# This file is loaded by pytest before test discovery begins.
os.environ.setdefault("GATE_PASSWORD", "testpassword")
os.environ.setdefault("SESSION_SECRET", "test-secret-key-for-testing-only-do-not-use-in-prod")
os.environ.setdefault("SESSION_EXPIRE_HOURS", "24")
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:3000")
os.environ.setdefault("ADMIN_SECRET", "testadminsecret")
os.environ.setdefault("DATABASE_URL", "sqlite:///./test_karisma.db")
