from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import ButtonLog, ButtonBox, Client, CounterLog, Sede, Level, Bathroom, Counter
from app.schemas.button_box import ButtonBoxCreate
from sqlalchemy.orm import Session
from sqlalchemy import select, literal, union_all, desc
from fastapi import HTTPException, status

def tarea_guardar_botonera(serie: str, letter: str, label: str, valor: int):
    db = SessionLocal()
    try:
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        dispositivo = db.query(ButtonBox).filter(ButtonBox.serie == int(serie)).first()
        
        if not dispositivo:
            print(f"[Botonera] Error: No existe un dispositivo registrado con la serie {serie}")
            return
    
        nuevo_log = ButtonLog(
            button_box_id=dispositivo.id, 
            letter=letter,
            label=label,
            create_time=create_time
        )
        
        db.add(nuevo_log)
        db.commit()
        print(f"Registro guardado en 'botonera' | ID Interno: {dispositivo.id} (Serie: {serie}) | Letra: {letter}")

    except Exception as e:
        db.rollback()
        print(f"Error al guardar el registro en 'botonera': {e}")
        
    finally:
        db.close()

def crear_botonera(db: Session, botonera: ButtonBoxCreate):
    """
    Registra una nueva botonera validando que la serie no esté duplicada.
    Usa la sesión inyectada por el endpoint para un manejo limpio de conexiones.
    """
    # 1. Validar si la serie ya existe en el sistema (Error 400)
    serie_existente = db.query(ButtonBox).filter(ButtonBox.serie == botonera.serie).first()
    if serie_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error: Ya existe una botonera registrada con la serie {botonera.serie}"
        )
        
    try:
        install_time = datetime.now(ZoneInfo("America/Bogota"))
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
        print(f"Error crítico en base de datos al crear botonera: {e}")
        # 2. Capturar cualquier fallo inesperado del motor (Error 500)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar el registro de la botonera en la base de datos"
        )

def obtener_botoneras_por_bano(db, bathroom_id: int):
    return db.query(ButtonBox).filter(ButtonBox.bathroom_id == bathroom_id).all()

def get_all_global_logs(db: Session, limit: int = 100, offset: int = 0):
    
    # 1. Query para los logs de los contadores (Ingresos)
    query_counters = select(
        Client.name.label("cliente"),
        CounterLog.create_time.label("fecha_hora"),
        Sede.name.label("sede"),
        Level.name.label("nivel"),
        Bathroom.gender.label("genero_bano"),
        Counter.serie.label("dispositivo_serie"),
        literal("ingreso").label("tipo_evento"),
        literal("flujo de personas").label("detalle_evento"),
        CounterLog.amount.label("valor")
    ).select_from(Client)\
     .join(Sede, Client.id == Sede.client_id)\
     .join(Level, Sede.id == Level.sede_id)\
     .join(Bathroom, Level.id == Bathroom.level_id)\
     .join(Counter, Bathroom.id == Counter.bathroom_id)\
     .join(CounterLog, Counter.serie == CounterLog.counter_serie)

    # 2. Query para los logs de las botoneras (Alertas)
    query_buttons = select(
        Client.name.label("cliente"),
        ButtonLog.create_time.label("fecha_hora"),
        Sede.name.label("sede"),
        Level.name.label("nivel"),
        Bathroom.gender.label("genero_bano"),
        ButtonBox.serie.label("dispositivo_serie"),
        literal("alerta").label("tipo_evento"),
        ButtonLog.label.label("detalle_evento"),
        literal(1).label("valor")
    ).select_from(Client)\
     .join(Sede, Client.id == Sede.client_id)\
     .join(Level, Sede.id == Level.sede_id)\
     .join(Bathroom, Level.id == Bathroom.level_id)\
     .join(ButtonBox, Bathroom.id == ButtonBox.bathroom_id)\
     .join(ButtonLog, ButtonBox.serie == ButtonLog.button_box_serie)

    # 3. Unimos ambas consultas usando UNION ALL y le damos un alias
    unified_query = union_all(query_counters, query_buttons).alias("logs_completos")

    stmt = select(unified_query)\
        .order_by(desc(unified_query.c.fecha_hora))\
        .limit(limit)\
        .offset(offset)

    logs_crudos = db.execute(stmt).mappings().all()
    historial = [dict(log) for log in logs_crudos]

    return {
        "registros_devueltos": len(historial),
        "limit": limit,
        "offset": offset,
        "historial_eventos": historial
    }



# nuevas funciones 17/06/2026 


def obtener_botonera_por_id_con_logs(db: Session, button_box_id: int, limit: int = 50, offset: int = 0):
    botonera = db.query(ButtonBox).filter(ButtonBox.id == button_box_id).first()
    if not botonera:
        return None

    # Aplicamos la paginación real aquí con .limit() y .offset()
    logs_recientes = (
        db.query(ButtonLog)
        .filter(ButtonLog.button_box_id == button_box_id)
        .order_by(desc(ButtonLog.create_time))
        .limit(limit)
        .offset(offset)
        .all()
    )
    
    return {
        "id": botonera.id,
        "serie": botonera.serie,
        "bathroom_id": botonera.bathroom_id,
        "install_time": botonera.install_time,
        "logs": [
            {
                "id": log.id,
                "letter": log.letter,
                "label": log.label,
                "create_time": log.create_time
            } for log in logs_recientes
        ]
    }

def editar_botonera(db: Session, button_box_id: int, datos_actualizar: dict):
    """
    Recibe un diccionario con los datos a editar (ej: {'bathroom_id': 2})
    y actualiza la botonera por su ID.
    """
    botonera = db.query(ButtonBox).filter(ButtonBox.id == button_box_id).first()
    if not botonera:
        return None
    
    try:
        for llave, valor in datos_actualizar.items():
            if hasattr(botonera, llave):
                setattr(botonera, llave, valor)
                
        db.commit()
        db.refresh(botonera)
        return botonera
    except Exception as e:
        db.rollback()
        print(f"Error al editar botonera ID {button_box_id}: {e}")
        return None

def eliminar_botonera(db: Session, button_box_id: int) -> bool:
    """
    Elimina una botonera por su ID. Debido al ON DELETE CASCADE que configuramos
    en la base de datos y en los modelos, se limpiarán sus logs automáticamente.
    """
    botonera = db.query(ButtonBox).filter(ButtonBox.id == button_box_id).first()
    if not botonera:
        return False
    
    try:
        db.delete(botonera)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Error al eliminar botonera ID {button_box_id}: {e}")
        return False