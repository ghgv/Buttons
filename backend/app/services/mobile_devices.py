from datetime import datetime

from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.models import MobileDevice

from app.core.logger import logger


def register_device(
    db: Session,
    user_id: int,
    body,
):

    device = (
        db.query(MobileDevice)
        .filter(
            MobileDevice.user_id == user_id,
            MobileDevice.fcm_token == body.fcm_token,
        )
        .first()
    )

    if device is None:

        device = MobileDevice(
            user_id=user_id,
            fcm_token=body.fcm_token,
        )

        db.add(device)

    device.platform = body.platform
    device.app_version = body.app_version
    device.model = body.model
    device.android_version = body.android_version
    device.last_seen = datetime.utcnow()
    device.active = True

    try:

        db.commit()
        db.refresh(device)

        logger.info(
            f"[Mobile] Dispositivo registrado | "
            f"User ID: {user_id} | "
            f"Platform: {body.platform}"
        )

        return {
            "success": True,
            "device_id": device.id,
        }

    except Exception as e:

        db.rollback()

        logger.error(
            f"[Mobile] Error registrando dispositivo: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error registrando dispositivo móvil.",
        )