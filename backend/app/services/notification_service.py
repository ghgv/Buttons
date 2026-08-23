from sqlalchemy.orm import Session
from firebase_admin._messaging_utils import UnregisteredError

from app.models.models import MobileDevice
from app.services.firebase_notifications import send_to_token


class NotificationService:

    @staticmethod
    def send_to_user(
        db: Session,
        user_id: int,
        title: str,
        body: str,
        data: dict | None = None,
    ):

        devices = (
            db.query(MobileDevice)
            .filter(
                MobileDevice.user_id == user_id,
                MobileDevice.active == True,
            )
            .all()
        )

        sent = 0

        for device in devices:

            try:

                send_to_token(
                    token=device.fcm_token,
                    title=title,
                    body=body,
                    data=data,
                )

                sent += 1

            except UnregisteredError:

                device.active = False

        db.commit()

        return sent