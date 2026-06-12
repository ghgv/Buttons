from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import CounterLog
from app.models.models import Counter
from app.schemas.counter import CounterCreate

def tarea_guardar_contadores(serie: str, valor: int):
    # Creamos nuestra propia sesión
    db = SessionLocal()
    try:
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        
        # Instanciamos el modelo
        nuevo_log = CounterLog(
            counter_serie=int(serie),
            amount=valor,
            create_time=create_time
        )
        
        db.add(nuevo_log)
        db.commit()
        print(f"Registro guardado en 'contadores' | Serie: {serie} | Valor: {valor}")
        
    except Exception as e:
        db.rollback()
        print(f"Error al guardar en 'contadores': {e}")
        
    finally:
        db.close()

def crear_contador(contador: CounterCreate):
    db = SessionLocal()
    install_time = datetime.now(ZoneInfo("America/Bogota"))
    try:
        serie_existente = (
            db.query(Counter)
            .filter(Counter.serie == contador.serie)
            .first()
        )

        if serie_existente:
            return {"message": "Error: Ya existe un contador con esa serie registrada"}
        
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
        print(f"Error al crear contador: {e}")
        return None
    finally:
        db.close()

def obtener_contadores_por_bano(db, bathroom_id: int):
    return db.query(Counter).filter(Counter.bathroom_id == bathroom_id).all()