from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_admin_user
from app.models.models import Sede
from app.schemas.sede import SedeCreate
from app.services.sedes import get_sedes, create_sede

router = APIRouter(prefix="/sedes", tags=["Gestión de Sedes"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_sede(
    sede_in: SedeCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return create_sede(db=db, sede_data=sede_in, client_id=sede_in.client_id)

@router.get("/", status_code=status.HTTP_200_OK)
def obtener_sedes(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return get_sedes(db=db, client_id=current_user["client_id"])

