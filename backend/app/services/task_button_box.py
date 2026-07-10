from datetime import datetime 
from zoneinfo import ZoneInfo
from app.core.database import SessionLocal
from app.models.models import ButtonLog, ButtonBox, Client, CounterLog, Sede, Level, Bathroom, Counter
from app.schemas.button_box import ButtonBoxCreate
from sqlalchemy.orm import Session
from sqlalchemy import select, literal, union_all, desc
from fastapi import HTTPException, status
from app.core.logger import logger

def tarea_guardar_botonera(serie: str, letter: str, label: str, valor: int):
    db = SessionLocal()
    try:
        create_time = datetime.now(ZoneInfo("America/Bogota"))
        
        dispositivo = db.query(ButtonBox).filter(ButtonBox.serie == int(serie)).first()
        
        if not dispositivo:
            print(f"[Botonera] Error: No existe un dispositivo registrado con la serie {serie}")
            logger.error(f"[Botonera] Error: No existe un dispositivo registrado con la serie {serie}")
            return
    
        nuevo_log = ButtonLog(
            button_box_id=dispositivo.id, 
            bathroom_id=dispositivo.bathroom_id, 
            letter=letter,
            label=label,
            create_time=create_time
        )
        
        db.add(nuevo_log)
        db.commit()
        print(f"✅ Registro guardado en 'button_logs' | ID Box: {dispositivo.id} | ID Baño: {dispositivo.bathroom_id} | Letra: {letter}")
        logger.info(f"[Botonera] Registro guardado en 'button_logs' | ID Box: {dispositivo.id} | ID Baño: {dispositivo.bathroom_id} | Letra: {letter}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error crítico al guardar el log de la botonera Serie {serie}: {e}")
        logger.error(f"[Botonera] Error crítico al guardar el log de la botonera Serie {serie}: {e}")
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
        logger.warning(f"[Botoneras] Intento de creación fallido: Serie duplicada {botonera.serie}")
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
        logger.info(f"[Botoneras] Botonera creada exitosamente | ID Interno: {nuevo_boton.id} | Serie: {botonera.serie} | Baño ID: {botonera.bathroom_id}")
        return nuevo_boton
        
    except Exception as e:
        db.rollback()
        logger.error(f"[Botoneras] Error crítico en base de datos al crear botonera: {e}")
        # 2. Capturar cualquier fallo inesperado del motor (Error 500)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar el registro de la botonera en la base de datos"
        )

def obtener_botoneras_por_bano(db, bathroom_id: int):
    return db.query(ButtonBox).filter(ButtonBox.bathroom_id == bathroom_id).all()

def get_logs_by_client(db: Session, client_id: int):
    """
    Obtiene el historial unificado filtrado estrictamente por un ID de cliente,
    utilizando el nuevo esquema relacional basado en IDs y LEFT JOINs.
    """
    query_counters = select(
        CounterLog.create_time.label("fecha_hora"),
        Sede.name.label("sede"),
        Level.name.label("nivel"),
        Bathroom.gender.label("genero_bano"),
        Counter.serie.label("dispositivo_serie"),
        literal("ingreso").label("tipo_evento"),
        literal("flujo de personas").label("detalle_evento"),
        CounterLog.amount.label("valor")
    ).select_from(CounterLog)\
     .join(Counter, CounterLog.counter_id == Counter.id)\
     .join(Bathroom, Counter.bathroom_id == Bathroom.id)\
     .join(Level, Bathroom.level_id == Level.id)\
     .join(Sede, Level.sede_id == Sede.id)\
     .join(Client, Sede.client_id == Client.id)\
     .where(Client.id == client_id)

    query_buttons = select(
        ButtonLog.create_time.label("fecha_hora"),
        Sede.name.label("sede"),
        Level.name.label("nivel"),
        Bathroom.gender.label("genero_bano"),
        ButtonBox.serie.label("dispositivo_serie"),
        literal("alerta").label("tipo_evento"),
        ButtonLog.label.label("detalle_evento"),
        literal(1).label("valor")
    ).select_from(ButtonLog)\
     .join(ButtonBox, ButtonLog.button_box_id == ButtonBox.id)\
     .join(Bathroom, ButtonBox.bathroom_id == Bathroom.id)\
     .join(Level, Bathroom.level_id == Level.id)\
     .join(Sede, Level.sede_id == Sede.id)\
     .join(Client, Sede.client_id == Client.id)\
     .where(Client.id == client_id)

    unified_query = union_all(query_counters, query_buttons).alias("metricas_completas")
    
    stmt = select(unified_query).order_by(desc(unified_query.c.fecha_hora))
    
    logs_crudos = db.execute(stmt).mappings().all()
    logger.info(f"[Historial] Obteniendo logs unificados para Cliente ID: {client_id} | Registros devueltos: {len(logs_crudos)}")
    return [dict(log) for log in logs_crudos]


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
    Modifica los parámetros de una botonera por su ID primario.
    Valida que la nueva serie no esté ocupada por otro dispositivo.
    """
    
    botonera = db.query(ButtonBox).filter(ButtonBox.id == button_box_id).first()
    if not botonera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se pudo actualizar: La botonera con ID {button_box_id} no existe."
        )
    
    nueva_serie = datos_actualizar.get("serie")
    if nueva_serie is not None:
        serie_duplicada = (
            db.query(ButtonBox)
            .filter(ButtonBox.serie == nueva_serie, ButtonBox.id != button_box_id)
            .first()
        )
        if serie_duplicada:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error: Ya existe otra botonera registrada con la serie {nueva_serie}."
            )
    
    try:
        for llave, valor in datos_actualizar.items():
            if hasattr(botonera, llave):
                setattr(botonera, llave, valor)
                
        db.commit()
        db.refresh(botonera)
        return botonera
        
    except Exception as e:
        db.rollback()
        print(f"Error crítico al editar botonera ID {button_box_id}: {e}")
        logger.error(f"[Botoneras] Error crítico al editar botonera ID {button_box_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al procesar la actualización en la base de datos."
        )
    

def eliminar_botonera(db: Session, button_box_id: int):
    """
    Elimina una botonera conservando sus logs históricos intactos (poniendo su FK en NULL).
    """
    botonera = db.query(ButtonBox).filter(ButtonBox.id == button_box_id).first()
    if not botonera:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se pudo eliminar: La botonera con ID {button_box_id} no existe."
        )
    
    try:
        db.query(ButtonLog).filter(ButtonLog.button_box_id == button_box_id).update(
            {"button_box_id": None}, 
            synchronize_session=False
        )
        
        
        db.delete(botonera)
        db.commit()
        logger.info(f"[Botoneras] Botonera eliminada exitosamente | ID Interno: {button_box_id} | Serie: {botonera.serie} | Baño ID: {botonera.bathroom_id}")
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error crítico al eliminar la botonera ID {button_box_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno al intentar eliminar la botonera en la base de datos."
        )
    

def get_all_global_logs(db: Session, limit: int = 100, offset: int = 0):
    """
    Devuelve el historial unificado de ingresos (contadores) y alertas (botoneras).
    Usa OUTER JOINs para asegurar que los logs de dispositivos eliminados (huérfanos)
    sigan apareciendo en el reporte global de analítica.
    """
    
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
    ).select_from(CounterLog)\
     .join(Counter, CounterLog.counter_id == Counter.id, isouter=True)\
     .join(Bathroom, Counter.bathroom_id == Bathroom.id, isouter=True)\
     .join(Level, Bathroom.level_id == Level.id, isouter=True)\
     .join(Sede, Level.sede_id == Sede.id, isouter=True)\
     .join(Client, Sede.client_id == Client.id, isouter=True)

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
    ).select_from(ButtonLog)\
     .join(ButtonBox, ButtonLog.button_box_id == ButtonBox.id, isouter=True)\
     .join(Bathroom, ButtonBox.bathroom_id == Bathroom.id, isouter=True)\
     .join(Level, Bathroom.level_id == Level.id, isouter=True)\
     .join(Sede, Level.sede_id == Sede.id, isouter=True)\
     .join(Client, Sede.client_id == Client.id, isouter=True)

    # 3. Unimos ambas consultas usando UNION ALL y le damos un alias
    unified_query = union_all(query_counters, query_buttons).alias("logs_completos")

    # 4. Construimos la sentencia final con ordenamiento y paginación dinámicos
    stmt = select(unified_query)\
        .order_by(desc(unified_query.c.fecha_hora))\
        .limit(limit)\
        .offset(offset)

    # 5. Ejecutamos y parseamos el resultado
    logs_crudos = db.execute(stmt).mappings().all()
    
    # Tratamos los valores None de los dispositivos eliminados para que el JSON sea amigable
    historial = []
    for log in logs_crudos:
        log_dict = dict(log)
        if log_dict["dispositivo_serie"] is None:
            log_dict["dispositivo_serie"] = "Dispositivo Eliminado"
        if log_dict["cliente"] is None:
            log_dict["cliente"] = "N/A"
        historial.append(log_dict)

    return {
        "registros_devueltos": len(historial),
        "limit": limit,
        "offset": offset,
        "historial_eventos": historial
    }