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

    logger.info(
        f"[Mobile] Solicitud de registro "
        f"user={user_id} "
        f"token={body.fcm_token[:30]}..."
    )

    # Un único dispositivo por usuario.
    device = (
        db.query(MobileDevice)
        .filter(
            MobileDevice.user_id == user_id,
        )
        .first()
    )

    if device is None:

        device = MobileDevice(
            user_id=user_id,
        )

        db.add(device)

        logger.info(
            f"[Mobile] Nuevo dispositivo para user={user_id}"
        )

    else:

        logger.info(
            f"[Mobile] Actualizando dispositivo "
            f"id={device.id} "
            f"user={user_id} "
            f"token_anterior={device.fcm_token[:30] if device.fcm_token else 'NULL'}..."
        )

    # Reemplazamos siempre el token por el más reciente
    device.fcm_token = body.fcm_token

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
            f"[Mobile] OK "
            f"user={user_id} "
            f"device={device.id} "
            f"platform={device.platform} "
            f"last_seen={device.last_seen} "
            f"token_nuevo={device.fcm_token[:30]}..."
        )

        return {
            "success": True,
            "device_id": device.id,
            "user_id": device.user_id,
        }

    except Exception as e:

        db.rollback()

        logger.exception(e)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error registrando dispositivo móvil.",
        )