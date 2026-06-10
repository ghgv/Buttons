from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy import text # <-- Importación necesaria para el query crudo
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
    
    # Usamos un diccionario agrupado por el nombre de la sede para una búsqueda rápida (O(1))
    sedes_agrupadas = {
        sede.name: {
            "id": sede.id,
            "name": sede.name,
            "eventos": []  # <-- Array vacío por defecto si no hay datos
        }
        for sede in sedes_db
    }

    # 4. Ejecutamos el query analítico
    query = text("""
        SELECT * FROM (
            SELECT 
                cl.create_time AS fecha_hora,
                s.name AS sede,
                l.name AS nivel,
                b.gender AS genero_bano,
                c1.serie AS dispositivo_serie,
                'ingreso' AS tipo_evento,
                'flujo de personas' AS detalle_evento,
                cl.amount AS valor
            FROM clients c
            JOIN sedes s ON c.id = s.client_id
            JOIN levels l ON s.id = l.sede_id
            JOIN bathrooms b ON l.id = b.level_id
            JOIN counters_1 c1 ON b.id = c1.bathroom_id
            JOIN counter_logs cl ON c1.serie = cl.counter_serie
            WHERE c.id = :client_id

            UNION ALL

            SELECT 
                bl.create_time AS fecha_hora,
                s.name AS sede,
                l.name AS nivel,
                b.gender AS genero_bano,
                bb.serie AS dispositivo_serie,
                'alerta' AS tipo_evento,
                bl.label AS detalle_evento,
                1 AS valor
            FROM clients c
            JOIN sedes s ON c.id = s.client_id
            JOIN levels l ON s.id = l.sede_id
            JOIN bathrooms b ON l.id = b.level_id
            JOIN button_box_1 bb ON b.id = bb.bathroom_id
            JOIN button_logs bl ON bb.serie = bl.button_box_serie
            WHERE c.id = :client_id
        ) AS metricas_completas
        ORDER BY fecha_hora DESC;
    """)

    eventos_crudos = db.execute(query, {"client_id": client_id}).mappings().all()
    
    # 5. Distribuimos los eventos en sus respectivas sedes
    for evento in eventos_crudos:
        nombre_sede = evento["sede"]
        if nombre_sede in sedes_agrupadas:
            # Convertimos el RowMapping a dict normal y lo agregamos al array
            sedes_agrupadas[nombre_sede]["eventos"].append(dict(evento))

    # 6. Retornamos el JSON estructurado
    return {
        "client_id": client_id,
        "resumen_infraestructura": {
            "total_sedes": total_sedes,
            "total_levels": total_levels,
            "total_bathrooms": total_bathrooms
        },
        "total_eventos": len(eventos_crudos),
        # Convertimos el diccionario nuevamente a una lista para el frontend
        "sedes_info": list(sedes_agrupadas.values()) 
    }