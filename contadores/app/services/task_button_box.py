from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import ButtonLog, ButtonBox
from app.schemas.button_box import button_boxCreate

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

def crear_botonera(botonera):
    db = SessionLocal()
    install_time = datetime.now(ZoneInfo("America/Bogota"))
    try:
        nuevo_boton = ButtonBox(
            serie=botonera.serie,
            bathroom_id=botonera.bathroom_id,
            install_time=install_time
        )
        db.add(nuevo_boton)
        db.commit()
        db.refresh(nuevo_boton)
        return nuevo_boton
    except Exception as e:
        db.rollback()
        print(f"Error al crear botonera: {e}")
        return None
    finally:
        db.close()

def obtener_botoneras_por_bano(db, bathroom_id: int):
    return db.query(ButtonBox).filter(ButtonBox.bathroom_id == bathroom_id).all()



