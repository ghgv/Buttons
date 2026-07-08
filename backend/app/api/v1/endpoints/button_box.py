from fastapi import APIRouter, BackgroundTasks, Response, status, Depends, Query, HTTPException
from app.services import task_button_box
from app.services.task_button_box import obtener_botoneras_por_bano as obtener_botoneras_por_bano_service
from app.models.models import Client, Sede, Level, Bathroom 
from app.schemas.button_box import (
    ButtonBoxCreate, 
    ButtonBoxUpdate, 
    ButtonBoxResponse, 
    ButtonBoxWithLogsResponse
)
from app.api.deps import get_admin_user, get_db

from sqlalchemy.orm import Session

router = APIRouter(prefix="/botonera", tags=["botonera"])

@router.get("/a.php")
async def botonera_a(serie: str, valor: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(task_button_box.tarea_guardar_botonera, serie, "A", "Baño con mal olor", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/b.php")
async def botonera_b(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    background_tasks.add_task(task_button_box.tarea_guardar_botonera, serie, "B", "Baño sin jabon", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/c.php")
async def botonera_c(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    background_tasks.add_task(task_button_box.tarea_guardar_botonera, serie, "C", "Baño sucio", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/d.php")
async def botonera_d(serie: str, valor: int, background_tasks: BackgroundTasks): # Cambié el nombre de la función
    print(f"Recibido: serie={serie}, valor={valor}")
    background_tasks.add_task(task_button_box.tarea_guardar_botonera, serie, "D", "Baño sin papel", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ButtonBoxResponse  
)
def crear_nueva_botonera(
    botonera_in: ButtonBoxCreate,
    db: Session = Depends(get_db)
    # current_user: dict = Depends(get_admin_user)
):
    nueva_botonera = task_button_box.crear_botonera(db=db, botonera=botonera_in)
    return nueva_botonera

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
    return task_button_box.get_all_global_logs(db=db, limit=limit, offset=offset)

@router.get("/bathroom/{bathroom_id}")
def obtener_botoneras_por_bano(
    bathroom_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_admin_user)
):
    botoneras = obtener_botoneras_por_bano_service(db, bathroom_id)
    return botoneras

@router.get("/{button_box_id}/logs", response_model=ButtonBoxWithLogsResponse)
def obtener_botonera_con_historial(
    button_box_id: int, 
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=100, description="Número de registros por página"),
    offset: int = Query(default=0, ge=0, description="Número de registros a omitir")
):
    res = task_button_box.obtener_botonera_por_id_con_logs(db, button_box_id, limit=limit, offset=offset)
    if not res:
        raise HTTPException(status_code=404, detail="Botonera no encontrada")
    return res

@router.put("/{button_box_id}", response_model=ButtonBoxResponse)
def modificar_botonera(
    button_box_id: int, 
    datos: ButtonBoxUpdate, 
    db: Session = Depends(get_db)
):
    update_data = datos.model_dump(exclude_unset=True)
    actualizada = task_button_box.editar_botonera(db, button_box_id, update_data)
    return actualizada

@router.delete("/{button_box_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_botonera(button_box_id: int, db: Session = Depends(get_db)):
    """
    Elimina una botonera del sistema por su ID primario.
    Los logs asociados se conservarán en la base de datos con su identificador en NULL.
    """
    task_button_box.eliminar_botonera(db, button_box_id)
    return None
