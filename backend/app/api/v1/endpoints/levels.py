from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_admin_user
from app.models.models import Level
from app.schemas.level import LevelCreate
from app.services.levels import get_levels, create_level

router = APIRouter(prefix="/levels", tags=["levels"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_level_endpoint(
    level_in: LevelCreate, 
    db: Session = Depends(get_db),
    # current_user=Depends(get_admin_user)
):
    return create_level(db, level_in)

@router.get("/{sede_id}", status_code=status.HTTP_200_OK)
def get_levels_by_sede_id(
    sede_id: int,
    db: Session = Depends(get_db),
    # current_user=Depends(get_admin_user)  
):
    return get_levels(db, sede_id)
