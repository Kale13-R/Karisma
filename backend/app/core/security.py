import hmac


def verify_password(plain: str, expected: str) -> bool:
    """Constant-time string comparison to prevent timing attacks."""
    return hmac.compare_digest(plain.encode(), expected.encode())
