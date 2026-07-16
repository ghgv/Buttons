from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.incidents import get_pending_incidents, resolve_incident

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.deps import get_db
from app.services.incidents import (
    get_pending_incidents,
    resolve_incident,
)


class ResolveIncident(BaseModel):
    resolved: bool
    comment: str


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


@router.get("")
def list_incidents(
    db: Session = Depends(get_db),
):
    return get_pending_incidents(db)


@router.post("/{incident_id}/resolve")
def close_incident(
    incident_id: int,
    body: ResolveIncident,
    db: Session = Depends(get_db),
):
    return resolve_incident(db, incident_id, body)