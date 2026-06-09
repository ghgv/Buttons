from fastapi import APIRouter, BackgroundTasks, Response, status, Depends, Query
from app.services.task_button_box import tarea_guardar_botonera, crear_botonera, get_all_global_logs
from app.services.task_button_box import obtener_botoneras_por_bano as obtener_botoneras_por_bano_service
from app.models.models import Client, Sede, Level, Bathroom 
from app.schemas.button_box import button_boxCreate
from app.api.deps import get_admin_user, get_db
from sqlalchemy.orm import Session




router = APIRouter(prefix="/botonera", tags=["botonera"])

@router.get("/a.php")
async def botonera_a(serie: str, valor: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(tarea_guardar_botonera, serie, "A", "Baño con mal olor", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/b.php")
async def botonera_b(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    background_tasks.add_task(tarea_guardar_botonera, serie, "B", "Baño sin jabon", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/c.php")
async def botonera_c(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    background_tasks.add_task(tarea_guardar_botonera, serie, "C", "Baño sucio", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/d.php")
async def botonera_d(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    background_tasks.add_task(tarea_guardar_botonera, serie, "D", "Baño sin papel", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/", status_code=status.HTTP_201_CREATED)
def crear_nueva_botonera(
    botonera_in: button_boxCreate,
    # current_user: dict = Depends(get_admin_user)
):
    nueva_botonera = crear_botonera(botonera_in)
    if nueva_botonera:
        return {"message": "Botonera creada exitosamente"}
    else:
        return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content="Error al crear la botonera")

@router.get("/logs")
def get_global_logs_endpoint(
    limit: int = Query(100, ge=1, le=1000, description="Cantidad máxima de registros a devolver (máx 1000)"),
    offset: int = Query(0, ge=0, description="Cantidad de registros a omitir (para paginación)"),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial global de todos los eventos (flujos de personas y alertas de botoneras),
    ordenados desde el más reciente al más antiguo.
    """
    return get_all_global_logs(db=db, limit=limit, offset=offset)

@router.get("/{bathroom_id}")
def obtener_botoneras_por_bano(
    bathroom_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user)
):
    botoneras = obtener_botoneras_por_bano_service(db, bathroom_id)
    return botoneras


