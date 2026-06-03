from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import CounterLog

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