from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.models import MobileDevice
from app.services.firebase_notifications import send_to_token

router = APIRouter(
    prefix="/test",
    tags=["Test"],
)


@router.post("/push")
def test_push(
    db: Session = Depends(get_db),
):

    device = (
        db.query(MobileDevice)
        .filter(
            MobileDevice.user_id == 3,
            MobileDevice.active == True,
        )
        .first()
    )

    if device is None:
        return {
            "success": False,
            "error": "No device registered",
        }

    message_id = send_to_token(
        token=device.fcm_token,
        title="Buttons",
        body="Primera notificación 🎉",
        data={
            "type": "test",
        },
    )

    return {
        "success": True,
        "message_id": message_id,
    }