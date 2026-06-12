from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_admin_user
from app.schemas.bathroom import BathroomCreate
from app.models.models import Bathroom, Sede, Level
from app.services.bathroom import create_bathroom, get_bathroom_by_level

route = APIRouter(prefix="/bathrooms", tags=["Gestión de Baños"])

@route.post("/", status_code=status.HTTP_201_CREATED)
def crear_baño(
    bathroom_in: BathroomCreate, 
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return create_bathroom(db=db, bathroom_data=bathroom_in)


@route.get("/{level_id}", status_code=status.HTTP_200_OK)
def listar_baños_por_nivel(
    level_id: int, 
    db: Session = Depends(get_db),
    # current_user: dict = Depends(get_admin_user) # <- Aquí usamos el candado correcto
):
    return get_bathroom_by_level(db=db, level_id=level_id)