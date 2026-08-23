from sqlalchemy.orm import Session
from app.core.logger import logger



from app.models.models import (
    ButtonLog,
    Bathroom,
    Level,
    Sede,
)

from app.core.logger import logger

def get_pending_incidents(
    db: Session,
    current_user: dict,
):

    logger.info(
        f"INCIDENTS role={current_user['role']} "
        f"client_id={current_user['client_id']}"
    )

    query = (
        db.query(ButtonLog)
        .join(
            Bathroom,
            ButtonLog.bathroom_id == Bathroom.id,
        )
        .join(
            Level,
            Bathroom.level_id == Level.id,
        )
        .join(
            Sede,
            Level.sede_id == Sede.id,
        )
        .filter(
            ButtonLog.status == "pending",
        )
    )

    if current_user["role"] != "nubeware_admin":
        query = query.filter(
            Sede.client_id == current_user["client_id"]
        )

    logs = (
        query
        .order_by(ButtonLog.create_time.desc())
        .all()
    )

    logger.info(f"INCIDENTS encontrados={len(logs)}")

    result = []

    for log in logs:

        bathroom = log.bathroom
        level = bathroom.level
        sede = level.sede
        client = sede.client

        result.append({
            "id": log.id,
            "client": client.name,
            "floor": level.name,
            "bathroom": bathroom.name,
            "alert": log.label,
            "created_at": log.create_time,
            "status": log.status,
        })

    return result

def resolve_incident(
    db: Session,
    incident_id: int,
    body,
    user_id: int,
):
    log = (
        db.query(ButtonLog)
        .filter(ButtonLog.id == incident_id)
        .first()
    )

    if log is None:
        return {
            "ok": False,
            "message": "Incidente no encontrado"
        }

    if body.resolved:
        log.status = "resolved"
    else:
        log.status = "ignored"

    log.technician_comment = body.comment

    from datetime import datetime
    log.resolved_time = datetime.utcnow()

    # Usuario autenticado que atendió la incidencia
    log.resolved_by = user_id

    db.commit()
    db.refresh(log)

    return {
        "ok": True,
        "incident_id": log.id,
        "status": log.status,
        "comment": log.technician_comment,
        "resolved_time": log.resolved_time,
        "resolved_by": log.resolved_by,
    }