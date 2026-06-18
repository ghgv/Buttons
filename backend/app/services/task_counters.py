from fastapi import HTTPException, status
from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import CounterLog
from app.models.models import Counter
from app.schemas.counter import CounterCreate
from sqlalchemy.orm import Session
from sqlalchemy import desc

def tarea_guardar_contadores(serie: str, valor: int):
    db = SessionLocal()
    try:
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        contador = db.query(Counter).filter(Counter.serie == int(serie)).first()
        
        if not contador:
            print(f"[Contadores] Error: No existe un contador registrado con la serie {serie}")
            return
        
        nuevo_log = CounterLog(
            counter_id=contador.id,
            bathroom_id=contador.bathroom_id,  
            amount=valor,
            create_time=create_time
        )
        
        db.add(nuevo_log)
        db.commit()
        print(f"Registro guardado en 'contadores' | ID Interno: {contador.id} (Serie: {serie}) | Valor: {valor} bathroom: {contador.bathroom_id}")
        
    except Exception as e:
        db.rollback()
        print(f"Error al guardar en 'contadores': {e}")
        
    finally:
        db.close()

def crear_contador(db: Session, contador: CounterCreate):
    """
    Registra un nuevo contador validando duplicados de serie.
    Usa la sesión inyectada por el endpoint para mantener consistencia.
    """
    serie_existente = db.query(Counter).filter(Counter.serie == contador.serie).first()
    if serie_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error: Ya existe un contador registrado con la serie {contador.serie}"
        )
        
    try:
        install_time = datetime.now(ZoneInfo("America/Bogota"))
        nuevo_contador = Counter(
            serie=contador.serie,
            bathroom_id=contador.bathroom_id,
            install_time=install_time
        )
        
        db.add(nuevo_contador)
        db.commit()
        db.refresh(nuevo_contador)
        return nuevo_contador
        
    except Exception as e:
        db.rollback()
        print(f"Error crítico en base de datos al crear contador: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar el registro en la base de datos"
        )

def obtener_contadores_por_bano(db, bathroom_id: int):
    return db.query(Counter).filter(Counter.bathroom_id == bathroom_id).all()


def obtener_contador_por_id_con_logs(db: Session, counter_id: int, limit: int = 50, offset: int = 0):
    contador = db.query(Counter).filter(Counter.id == counter_id).first()
    if not contador:
        return None

    # Aplicamos la paginación real aquí con .limit() y .offset()
    logs_recientes = (
        db.query(CounterLog)
        .filter(CounterLog.counter_id == counter_id)
        .order_by(desc(CounterLog.create_time))
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return {
        "id": contador.id,
        "serie": contador.serie,
        "bathroom_id": contador.bathroom_id,
        "logs": [
            {
                "id": log.id,
                "amount": log.amount,
                "create_time": log.create_time
            } for log in logs_recientes
        ]
    }

def editar_contador(db: Session, counter_id: int, datos_actualizar: dict):
    """
    Modifica los parámetros de un contador (como reubicarlo de baño).
    """
    contador = db.query(Counter).filter(Counter.id == counter_id).first()
    if not contador:
        return None
    
    try:
        for llave, valor in datos_actualizar.items():
            if hasattr(contador, llave):
                setattr(contador, llave, valor)
                
        db.commit()
        db.refresh(contador)
        return contador
    except Exception as e:
        db.rollback()
        print(f"Error al editar el contador ID {counter_id}: {e}")
        return None

def eliminar_contador(db: Session, counter_id: int):
    """
    Elimina un contador por su ID conservando sus logs de ingresos intactos (poniendo su FK en NULL).
    """
    contador = db.query(Counter).filter(Counter.id == counter_id).first()
    if not contador:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se pudo eliminar: El contador con ID {counter_id} no existe."
        )
    
    try:
        db.query(CounterLog).filter(CounterLog.counter_id == counter_id).update(
            {"counter_id": None},
            synchronize_session=False
        )
        
        db.delete(contador)
        db.commit()
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error crítico al eliminar el contador ID {counter_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al intentar eliminar el contador en la base de datos."
        )