from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Client, Sede, Level, Bathroom

def metrics_by_id_client(db: Session, client_id: int):
    # 1. Validamos que el cliente exista
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    
    # 2. Conteos de infraestructura
    total_sedes = db.query(Sede).filter(Sede.client_id == client_id).count()
    total_levels = db.query(Level).join(Sede).filter(Sede.client_id == client_id).count()
    total_bathrooms = db.query(Bathroom).join(Level).join(Sede).filter(Sede.client_id == client_id).count()
    
    # 3. Obtenemos TODAS las sedes y las preparamos con un array vacío
    sedes_db = db.query(Sede).filter(Sede.client_id == client_id).all()
    
    # Comprensión de diccionario corregida (la llave se cierra al puro final del 'for')
    sedes_agrupadas = {
        sede.name: {
            "id": sede.id,
            "name": sede.name,
            "eventos": []  # <-- Array vacío por defecto si no hay datos
        }
        for sede in sedes_db
    }
    # 4. Ejecutamos el query analítico corregido (Esquema por ID y resistente a nulos)
    query = text("""
        SELECT * FROM (
            -- 1. MÓDULO DE CONTADORES (INGRESOS)
            SELECT 
                cl.create_time AS fecha_hora,
                s.name AS sede,
                l.name AS nivel,
                b.gender AS genero_bano,
                c1.serie AS dispositivo_serie,
                'ingreso' AS tipo_evento,
                'flujo de personas' AS detalle_evento,
                cl.amount AS valor
            FROM counter_logs cl
            LEFT JOIN counters_1 c1 ON cl.counter_id = c1.id
            LEFT JOIN bathrooms b ON c1.bathroom_id = b.id
            LEFT JOIN levels l ON b.level_id = l.id
            LEFT JOIN sedes s ON l.sede_id = s.id
            LEFT JOIN clients c ON s.client_id = c.id
            WHERE c.id = :client_id

            UNION ALL

            -- 2. MÓDULO DE BOTONERAS (ALERTAS)
            SELECT 
                bl.create_time AS fecha_hora,
                s.name AS sede,
                l.name AS nivel,
                b.gender AS genero_bano,
                bb.serie AS dispositivo_serie,
                'alerta' AS tipo_evento,
                bl.label AS detalle_evento,
                1 AS valor
            FROM button_logs bl
            LEFT JOIN button_box_1 bb ON bl.button_box_id = bb.id
            LEFT JOIN bathrooms b ON bb.bathroom_id = b.id
            LEFT JOIN levels l ON b.level_id = l.id
            LEFT JOIN sedes s ON l.sede_id = s.id
            LEFT JOIN clients c ON s.client_id = c.id
            WHERE c.id = :client_id
        ) AS metricas_completas
        ORDER BY fecha_hora DESC;
    """)

    eventos_crudos = db.execute(query, {"client_id": client_id}).mappings().all()
    
    # 5. Distribuimos los eventos en sus respectivas sedes
    for evento in eventos_crudos:
        # Si el dispositivo fue borrado, la sede vendrá como None en el LEFT JOIN.
        # Lo manejamos asignándolo a una sede genérica o controlando que no rompa el diccionario.
        nombre_sede = evento["sede"] if evento["sede"] is not None else "Dispositivos Desvinculados"
        
        # Si por alguna razón la clave no existe en el diccionario (ej: dispositivos huérfanos), la creamos dinámicamente
        if nombre_sede not in sedes_agrupadas:
            sedes_agrupadas[nombre_sede] = {
                "id": None,
                "name": nombre_sede,
                "eventos": []
            }
            
        evento_dict = dict(evento)
        # Limpieza visual para el JSON del frontend
        if evento_dict["dispositivo_serie"] is None:
            evento_dict["dispositivo_serie"] = "Dispositivo Eliminado"
            
        sedes_agrupadas[nombre_sede]["eventos"].append(evento_dict)

    # 6. Retornamos el JSON estructurado
    return {
        "client_id": client_id,
        "resumen_infraestructura": {
            "total_sedes": total_sedes,
            "total_levels": total_levels,
            "total_bathrooms": total_bathrooms
        },
        "total_eventos": len(eventos_crudos),
        "sedes_info": list(sedes_agrupadas.values()) 
    }