from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Bathroom, Sede, Level
from app.schemas.bathroom import BathroomCreate
from app.core.logger import logger

def create_bathroom(db: Session, bathroom_data: BathroomCreate):
    # Verificar que el level_id exista
    level = db.query(Level).filter(Level.id == bathroom_data.level_id).first()
    if not level:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Level no encontrado")

    new_bathroom = Bathroom(
        name=bathroom_data.name,
        level_id=bathroom_data.level_id,
        gender=bathroom_data.gender,
        description=bathroom_data.description
    )
    db.add(new_bathroom)
    db.commit()
    db.refresh(new_bathroom)
    return new_bathroom

def get_bathroom_by_level(db: Session, level_id: int):
    bathrooms = db.query(Bathroom).filter(Bathroom.level_id == level_id).all()
    return bathrooms