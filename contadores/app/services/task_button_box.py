from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import ButtonLog

def tarea_guardar_botonera(serie: str, letter: str, label: str, valor: int):
    db = SessionLocal()
    try:
        create_time = datetime.now(ZoneInfo("America/Bogota"))
    
        nuevo_log = ButtonLog(
            button_box_serie=int(serie),
            letter=letter,
            label=label,
            create_time=create_time
        )
        
        db.add(nuevo_log)
        db.commit()
        print(f"Registro guardado en 'botonera' | Serie: {serie} | Letra: {letter}")
        
    except Exception as e:
        db.rollback()
        print(f"Error al guardar el registro en 'botonera': {e}")
        
    finally:
        db.close()