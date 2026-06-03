from fastapi import APIRouter, BackgroundTasks, Response, status
from app.services.task_button_box import tarea_guardar_botonera

router = APIRouter(prefix="/botonera", tags=["botonera"])

@router.get("/a.php")
async def botonera_a(serie: str, valor: int, background_tasks: BackgroundTasks):
    background_tasks.add_task(tarea_guardar_botonera, serie, "A", "Baño sin papel", valor)
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
    background_tasks.add_task(tarea_guardar_botonera, serie, "D", "mal olor", valor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)