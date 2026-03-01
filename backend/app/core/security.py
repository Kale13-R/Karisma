import hmac


def verify_password(input: str, stored: str) -> bool:
    """Constant-time password comparison to prevent timing attacks."""
    return hmac.compare_digest(input.encode("utf-8"), stored.encode("utf-8"))
