import hmac

import bcrypt


def verify_password(input: str, stored: str) -> bool:
    """Constant-time comparison for gate password (plain text, stored in SiteConfig)."""
    return hmac.compare_digest(input.encode("utf-8"), stored.encode("utf-8"))


def hash_password(plain: str) -> str:
    """Bcrypt-hash a user account password."""
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password_hash(plain: str, hashed: str) -> bool:
    """Verify a user account password against its bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
