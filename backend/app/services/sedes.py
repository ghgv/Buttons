from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Sede
from app.schemas.sede import SedeCreate
from app.core.logger import logger

def create_sede(db: Session, sede_data: SedeCreate, client_id: int ):
    """
    Recibe los datos validados, crea el objeto SQLAlchemy y lo guarda en la base de datos.
    """
    new_sede = Sede(
        client_id=client_id,
        name=sede_data.name,
        address=sede_data.address
    )

    try:
        db.add(new_sede)
        db.commit()
        db.refresh(new_sede)
        logger.info(f"[Sedes] Sede creada exitosamente | ID Interno: {new_sede.id} | Nombre: {sede_data.name} | Cliente ID: {client_id}")
        return new_sede

    except Exception as e:
        db.rollback()
        logger.error(f"[Sedes] Error crítico en base de datos al crear sede: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al guardar la sede: {str(e)}"
        )

def get_sedes (db: Session, client_id: int):
    """
    Retorna la lista de sedes asociadas a un cliente específico.
    """
    return db.query(Sede).filter(Sede.client_id == client_id).all()