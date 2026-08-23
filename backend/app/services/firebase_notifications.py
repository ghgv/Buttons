from firebase_admin import credentials
from firebase_admin import messaging
from firebase_admin import initialize_app

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

cred = credentials.Certificate(
    BASE_DIR / "keys" / "firebase.json"
)

initialize_app(cred)


def send_to_token(
    token: str,
    title: str,
    body: str,
    data: dict | None = None,
):

    message = messaging.Message(

        notification=messaging.Notification(

            title=title,

            body=body,

        ),

        token=token,

        data=data or {},

    )

    return messaging.send(message)