from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import ButtonLog, ButtonBox, Client, CounterLog, Sede, Level, Bathroom, Counter
from app.schemas.button_box import button_boxCreate
from sqlalchemy.orm import Session
from sqlalchemy import select, literal, union_all, desc

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

    # 4. Consulta final: Seleccionamos de la unión, ordenamos por fecha y paginamos
    stmt = select(unified_query)\
        .order_by(desc(unified_query.c.fecha_hora))\
        .limit(limit)\
        .offset(offset)

    # 5. Ejecutamos la consulta y convertimos a diccionarios
    logs_crudos = db.execute(stmt).mappings().all()
    historial = [dict(log) for log in logs_crudos]

    return {
        "registros_devueltos": len(historial),
        "limit": limit,
        "offset": offset,
        "historial_eventos": historial
    }

