from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Level
from app.schemas.level import LevelCreate
from app.models.models import Sede
from app.core.logger import logger

def get_levels(db: Session, sede_id: int):
    return db.query(Level).filter(Level.sede_id == sede_id).all()

def create_level(db: Session, level_data: LevelCreate):
    # Verificar que la sede existe antes de crear el nivel
    sede = db.query(Sede).filter(Sede.id == level_data.sede_id).first()
    if not sede:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sede no encontrada")

    new_level = Level(
        name=level_data.name.strip(),
        floor=level_data.floor,
        sede_id=level_data.sede_id
    )
    db.add(new_level)
    db.commit()
    db.refresh(new_level)
    logger.info(f"[Niveles] Nivel creado exitosamente | ID Interno: {new_level.id} | Nombre: {level_data.name} | Piso: {level_data.floor} | Sede ID: {level_data.sede_id}")
    return new_level