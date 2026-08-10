import os
import smtplib
import ssl

from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv("/home/ubuntu/Buttons/backend/.env")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")


def send_password_reset_email(
    email: str,
    token: str,
) -> None:

    reset_url = (
        "https://www.dali.com.co/reset-password"
        f"?token={token}"
    )

    msg = EmailMessage()

    msg["Subject"] = "Recuperación de contraseña - Nubeware"
    msg["From"] = SMTP_FROM
    msg["To"] = email

    msg.set_content(
        f"""
Hola,

Recibimos una solicitud para restablecer tu contraseña.

Puedes establecer una nueva contraseña usando este enlace:

{reset_url}

El enlace es válido durante 30 minutos y solo puede utilizarse una vez.

Si no solicitaste este cambio, puedes ignorar este correo.

Nubeware
"""
    )

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL(
        SMTP_HOST,
        SMTP_PORT,
        context=context,
        timeout=15,
    ) as smtp:

        smtp.login(
            SMTP_USER,
            SMTP_PASSWORD,
        )

        smtp.send_message(msg)