from sqlalchemy.orm import Session

from app.models.models import ButtonLog


def get_pending_incidents(db: Session):

    logs = (
        db.query(ButtonLog)
        .filter(ButtonLog.status == "pending")
        .order_by(ButtonLog.create_time.desc())
        .all()
    )

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

            "status": log.status

        })

    return result


def resolve_incident(
    db: Session,
    incident_id: int,
    body
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

    db.commit()

    return {
        "ok": True
    }