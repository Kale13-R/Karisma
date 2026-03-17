import resend

from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY


def send_welcome_email(user_email: str) -> None:
    if not settings.RESEND_API_KEY:
        print(f"[EMAIL SKIPPED] No RESEND_API_KEY set. Would have sent welcome to {user_email}")
        return

    resend.Emails.send({
        "from": settings.RESEND_FROM_EMAIL,
        "to": user_email,
        "subject": "Welcome to Karisma",
        "html": f"""
        <div style="background:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;padding:48px;max-width:600px;margin:0 auto;">
            <h1 style="font-size:28px;letter-spacing:0.2em;font-weight:900;margin-bottom:4px;border-bottom:4px solid #000;padding-bottom:16px;">
                KARISMA: ACCESS GRANTED
            </h1>
            <p style="letter-spacing:0.15em;font-size:11px;color:#555;margin-bottom:48px;margin-top:8px;">
                ACCOUNT CREATED — {user_email.upper()}
            </p>

            <p style="font-size:11px;letter-spacing:0.05em;color:#333;line-height:1.8;margin-bottom:48px;">
                Your account is live.<br>
                Every order you place will be tracked here.<br>
                Stay ready.
            </p>

            <div style="border-top:4px solid #000;padding-top:16px;">
                <p style="font-size:10px;letter-spacing:0.4em;font-weight:900;margin:0;">
                    PREPARE FOR THE ARCHIVE
                </p>
                <p style="font-size:9px;letter-spacing:0.1em;color:#888;margin-top:4px;">
                    karisma — ss26 drop
                </p>
            </div>
        </div>
        """,
    })


def send_order_confirmation(
    customer_email: str,
    order_id: str,
    total: float,
    items_json: str,
) -> None:
    if not settings.RESEND_API_KEY:
        print(f"[EMAIL SKIPPED] No RESEND_API_KEY set. Would have sent to {customer_email}")
        return

    resend.Emails.send({
        "from": settings.RESEND_FROM_EMAIL,
        "to": customer_email,
        "subject": "Your Karisma Order is Confirmed",
        "html": f"""
        <div style="background:#ffffff;color:#000000;font-family:'Courier New',Courier,monospace;padding:48px;max-width:600px;margin:0 auto;">
            <h1 style="font-size:28px;letter-spacing:0.2em;font-weight:900;margin-bottom:4px;border-bottom:4px solid #000;padding-bottom:16px;">
                KARISMA: CONFIRMED
            </h1>
            <p style="letter-spacing:0.15em;font-size:11px;color:#555;margin-bottom:48px;margin-top:8px;">
                ORDER #{order_id.upper()}
            </p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
                <tr style="border-bottom:2px solid #000;">
                    <td style="padding:8px 0;font-size:11px;letter-spacing:0.1em;">ORDER TOTAL</td>
                    <td style="padding:8px 0;font-size:20px;font-weight:700;text-align:right;">${total:.2f}</td>
                </tr>
            </table>

            <p style="font-size:11px;letter-spacing:0.05em;color:#333;line-height:1.8;margin-bottom:48px;">
                Your order has been received and is being prepared.<br>
                Tracking information will follow once your items have been dispatched.
            </p>

            <div style="border-top:4px solid #000;padding-top:16px;">
                <p style="font-size:10px;letter-spacing:0.4em;font-weight:900;margin:0;">
                    PREPARE FOR THE ARCHIVE
                </p>
                <p style="font-size:9px;letter-spacing:0.1em;color:#888;margin-top:4px;">
                    karisma — ss26 drop
                </p>
            </div>
        </div>
        """,
    })
